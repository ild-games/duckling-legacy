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
import {resizePoint} from '../../entitysystem/services/resize';
import {Vector, vectorAdd, vectorSubtract, vectorRound, vectorMultiply, vectorModulus} from '../../math/vector';
import {Box2} from '../../math/box2';
import {newMergeKey} from '../../state';
import {SelectionService} from '../../selection';
import {ProjectService} from '../../project/project.service';
import {KeyboardCode} from '../../util';
import {drawRectangle} from '../drawing';


import {BaseTool, CanvasMouseEvent, CanvasKeyEvent} from './base-tool';
import {minCornerSnapDistance} from './_grid-snap';
import {SnapToGridService} from './grid-snap.service';

@Injectable()
export class EntityMoveTool extends BaseTool {
    private _selectedEntityKey : EntityKey;

    private _mergeKey : any;
    private _initalEntity : Entity;
    private _initialMouseLocation : Vector;

    constructor(private _entitySelectionService: EntitySelectionService,
                private _entitySystemService : EntitySystemService,
                private _entityPositionService : EntityPositionService,
                private _selectionService : SelectionService,
                private _snapToGridService : SnapToGridService,
                private _entityBoxService : EntityBoxService,
                private _projectService : ProjectService) {
        super();
    }

    getDisplayObject(canvasZoom : number) : DisplayObject {
        let container = new PIXI.Container();
        let entityBox = this._getSelectedEntityBox();
        if (entityBox) {
            container.addChild(this._drawSelectionBox(entityBox, canvasZoom));
        }
        return container;
    }

    onStageDown(event : CanvasMouseEvent) {
        this._selectedEntityKey = this._entitySelectionService.getEntityKey(event.stageCoords);
        this._mergeKey = newMergeKey();
        this._selectionService.select(this._selectedEntityKey, this._mergeKey);

        if (this._selectedEntityKey) {
            this._initalEntity = this._entitySystemService.getEntity(this._selectedEntityKey);
            this._initialMouseLocation = event.stageCoords;
        }
    }

    onStageMove(event : CanvasMouseEvent) {
        if (!this._selectedEntityKey) {
            return;
        }

        let dragDistance = vectorSubtract(event.stageCoords, this._initialMouseLocation);

        if (this._snapToGridService.shouldSnapToGrid(event)) {
            let initialBox = this._entityBoxService.getEntityBox(this._initalEntity);
            let destination = vectorAdd(initialBox.position, dragDistance);
            let snappedDestination = this._snapToGridService.snapBox(destination, initialBox);
            dragDistance = vectorSubtract(snappedDestination, initialBox.position);
        }

        let initialPosition = this._entityPositionService.getPosition(this._initalEntity);
        let updatedEntity = this._entityPositionService.setPosition(this._initalEntity, vectorAdd(dragDistance, initialPosition));
        this._entitySystemService.updateEntity(this._selectedEntityKey, updatedEntity, this._mergeKey);
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
        } else if (this._isDeleteKey(event.keyCode)) {
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

    private _adjustEntityPosition(adjustment : Vector) {
        let selection = this._selectionService.selection.value;
        let oldPosition = this._entityPositionService.getPosition(selection.entity);
        let updatedEntity = this._entityPositionService.setPosition(selection.entity, vectorAdd(oldPosition, adjustment));
        this._entitySystemService.updateEntity(selection.selectedEntity, updatedEntity);
    }

    private _deleteSelectedEntity() {
        let mergeKey = newMergeKey();
        let entityKey = this._selectionService.selection.value.selectedEntity;
        this._selectionService.deselect(mergeKey);
        this._entitySystemService.deleteEntity(entityKey, mergeKey);
    }

    private _cancel() {
        this._selectedEntityKey = null;
        this._mergeKey = null;
        this._initalEntity = null;
        this._initialMouseLocation = null;
    }

    private _drawSelectionBox(box : Box2, canvasZoom : number) : Graphics {
        let graphics = new Graphics();
        graphics.lineStyle(1 / canvasZoom, 0x3355cc, 1);
        drawRectangle(box.position, box.dimension, graphics);
        return graphics;
    }

    private _getSelectedEntityBox() {
        let selectedEntity = this._selectionService.selection.getValue().entity;
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
