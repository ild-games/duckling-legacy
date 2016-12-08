import {Injectable} from '@angular/core';
import {Graphics, DisplayObject} from 'pixi.js';

import {
    EntitySelectionService,
    EntitySystemService,
    EntityPositionService,
    EntityKey,
    Entity,
    EntityBoxService
} from '../../entitysystem';
import {Vector, vectorAdd, vectorSubtract, vectorRound, vectorMultiply, vectorModulus} from '../../math/vector';
import {Box2} from '../../math/box2';
import {newMergeKey} from '../../state';
import {SelectionService} from '../../selection';
import {ProjectService} from '../../project/project.service';
import {KeyboardCode} from '../../util';
import {drawRectangle} from '../drawing';


import {BaseTool, CanvasMouseEvent, CanvasKeyEvent} from './base-tool';
import {minCornerSnapDistance} from './_grid-snap';

@Injectable()
export class EntityMoveTool extends BaseTool {
    private _selection : EntityKey;
    private _mergeKey : any;
    private _selectOffsetCoords : Vector = {x: 0, y: 0};

    constructor(private _entitySelectionService: EntitySelectionService,
                private _entitySystemService : EntitySystemService,
                private _entityPositionService : EntityPositionService,
                private _selectionService : SelectionService,
                private _entityBoxService : EntityBoxService,
                private _projectService : ProjectService) {
        super();
    }

    getDisplayObject(canvasZoom : number) : DisplayObject {
        return this._drawSelectionBox(this._getSelectedEntityBox(), canvasZoom);
    }

    onStageDown(event : CanvasMouseEvent) {
        this._selection = this._entitySelectionService.getEntityKey(event.stageCoords);
        this._selectOffsetCoords = {x: 0, y: 0};
        if (this._selection) {
            let entity = this._entitySystemService.getEntity(this._selection);
            let position = this._entityPositionService.getPosition(entity);
            this._selectOffsetCoords = vectorSubtract(position, event.stageCoords);
        }
        this._mergeKey = newMergeKey();
        this._selectionService.select(this._selection, this._mergeKey);
    }

    onStageMove(event : CanvasMouseEvent) {
        if (this._selection) {
            let destination = vectorRound(vectorAdd(event.stageCoords, this._selectOffsetCoords));
            let gridSize = this._projectService.project.getValue().currentMap.gridSize;
            if (!this._isSnapToGrid(event)) {
                let gridSize = this._projectService.project.getValue().currentMap.gridSize;
                destination = vectorSubtract(destination, minCornerSnapDistance(
                    destination, 
                    this._getSelectedEntityBox(), 
                    {x: gridSize, y: gridSize}));
            }
            this._entityPositionService.setPosition(this._selection, destination, this._mergeKey);
        }
    }
    onStageUp(event : CanvasMouseEvent) {
        this._cancel();
    }

    onKeyDown(event : CanvasKeyEvent) {
        if (!this._selectionService.selection.value.entity) {
            return;
        }
        
        if (this._isMovementKey(event.keyCode)) {
            this._adjustEntityPosition(this._keyEventToPositionAdjustment(event));
        }
        else if (this._isDeleteKey(event.keyCode)) {
            this._deleteSelectedEntity();
        }
    }

    onLeaveStage() {
        this._cancel();
    }

    get key() {
        return "EntityMoveTool";
    }

    get label() {
        return "Move Entity";
    }

    get icon() {
        return "arrows";
    }

    private _isSnapToGrid(event : CanvasMouseEvent) {
        return event.shiftKey;
    }

    private _adjustEntityPosition(adjustment : Vector) {
        let oldPosition = this._entityPositionService.getPosition(this._selectionService.selection.value.entity);
        this._entityPositionService.setPosition(
            this._selectionService.selection.value.selectedEntity,
            vectorAdd(oldPosition, adjustment),
            this._mergeKey);
    }

    private _deleteSelectedEntity() {
        let mergeKey = newMergeKey();
        let entityKey = this._selectionService.selection.value.selectedEntity;
        this._selectionService.deselect(mergeKey);
        this._entitySystemService.deleteEntity(entityKey, mergeKey);
    }
    
    private _cancel() {
        this._selection = null;
    }

    private _drawSelectionBox(box : Box2, canvasZoom : number) : Graphics {
        let graphics : Graphics = null;
        if (box) {
            graphics = new Graphics();
            graphics.lineStyle(1 / canvasZoom, 0x3355cc, 1);
            drawRectangle(box.position, box.dimension, graphics);
        }
        return graphics;
    }
    
    private _getSelectedEntityBox() {
        let selectedEntityKey = this._selectionService.selection.value.selectedEntity;
        let selectedEntity = this._entitySystemService.getEntity(selectedEntityKey);
        let box : Box2 = null;
        if (selectedEntity) {
            box = this._entityBoxService.getEntityBox(selectedEntity);
        }
        return box;
    }

    private _keyEventToPositionAdjustment(event : CanvasKeyEvent) : Vector {
        let modifier : number;
        if (event.altKey) {
            modifier = 1;
        } else if (event.shiftKey) {
            modifier = this._projectService.project.getValue().currentMap.gridSize * 2; 
        } else {
            modifier = this._projectService.project.getValue().currentMap.gridSize / 4; 
        }
        let adjustment : Vector;
        let keyCode = event.keyCode;
        if (keyCode === KeyboardCode.UP) {
            adjustment = { x: 0, y: -modifier };
        } else if (keyCode === KeyboardCode.RIGHT) {
            adjustment = { x: modifier, y: 0 };
        } else if (keyCode === KeyboardCode.DOWN) {
            adjustment = { x: 0, y: modifier };
        } else if (keyCode === KeyboardCode.LEFT) {
            adjustment = { x: -modifier, y: 0 };
        }
        return adjustment;
    }

    private _isMovementKey(keyCode : number) : boolean {
        return (
            keyCode === KeyboardCode.UP ||
            keyCode === KeyboardCode.RIGHT ||
            keyCode === KeyboardCode.DOWN ||
            keyCode === KeyboardCode.LEFT
        );
    }

    private _isDeleteKey(keyCode : number) : boolean {
        return keyCode === KeyboardCode.DELETE;
    }
}
