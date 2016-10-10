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
import {Box2, Vector, vectorAdd, vectorSubtract, vectorRound} from '../../math';
import {newMergeKey} from '../../state';
import {SelectionService} from '../../selection';
import {KeyboardCode} from '../../util';
import {drawRectangle} from '../drawing';


import {BaseTool, CanvasMouseEvent, CanvasKeyEvent} from './base-tool';

@Injectable()
export class EntityMoveTool extends BaseTool {
    private _selection : EntityKey;
    private _mergeKey : any;
    private _selectOffsetCoords : Vector = {x: 0, y: 0};

    constructor(private _entitySelectionService: EntitySelectionService,
                private _entitySystemService : EntitySystemService,
                private _entityPositionService : EntityPositionService,
                private _selectionService : SelectionService,
                private _entityBoxService : EntityBoxService) {
        super();
    }

    getDisplayObject(canvasZoom : number) : DisplayObject {
        return this._buildSelectionBox(canvasZoom);
    }

    onStageDown(event : CanvasMouseEvent) {
        this._selection = this._entitySelectionService.getEntityKey(event.stageCoords);
        this._selectOffsetCoords = {x: 0, y: 0};
        if (this._selection) {
            let position = this._entityPositionService.getPosition(this._selection);
            this._selectOffsetCoords = vectorSubtract(position, event.stageCoords);
        }
        this._mergeKey = newMergeKey();
        this._selectionService.select(this._selection, this._mergeKey);
    }

    onStageMove(event : CanvasMouseEvent) {
        if (this._selection) {
            this._entityPositionService.setPosition(
                this._selection,
                vectorRound(vectorAdd(event.stageCoords, this._selectOffsetCoords)),
                this._mergeKey);
        }
    }

    onStageUp(event : CanvasMouseEvent) {
        this._cancel();
    }

    onKeyDown(event : CanvasKeyEvent) {
        if (this._selectionService.selection.value.entity && this._isMovementKey(event.keyCode)) {
            let oldPosition = this._entityPositionService.getPosition(this._selectionService.selection.value.selectedEntity);
            let adjustment = this._keyEventToPositionAdjustment(event.keyCode);
            this._entityPositionService.setPosition(
                this._selectionService.selection.value.selectedEntity,
                vectorAdd(oldPosition, adjustment),
                this._mergeKey);
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

    private _cancel() {
        this._selection = null;
    }

    private _buildSelectionBox(canvasZoom : number) : DisplayObject {
        let graphics : Graphics = null;
        let selectedEntityKey = this._selectionService.selection.value.selectedEntity;
        let selectedEntity = this._entitySystemService.getEntity(selectedEntityKey);
        if (selectedEntity) {
            graphics = this._buildSelectionBoxAroundEntity(selectedEntity, canvasZoom);
        }
        return graphics;
    }

    private _buildSelectionBoxAroundEntity(entity : Entity, canvasZoom : number) : Graphics {
        let graphics : Graphics = null;
        let box = this._entityBoxService.getEntityBox(entity);
        if (box) {
            graphics = new Graphics();
            graphics.lineStyle(1 / canvasZoom, 0x3355cc, 1);
            drawRectangle(box.position, box.dimension, graphics);
            this._drawTransformCorners(graphics, box, canvasZoom);
        }
        return graphics;
    }

    private _drawTransformCorners(graphics : Graphics, box : Box2, canvasZoom : number) {
        graphics.lineStyle(1 / canvasZoom, 0x000000, 1);
        graphics.beginFill(0x000000, 1);
        this._drawTransformCorner(graphics, box, canvasZoom, {x: 1, y: 1});
        this._drawTransformCorner(graphics, box, canvasZoom, {x: -1, y: 1});
        this._drawTransformCorner(graphics, box, canvasZoom, {x: 1, y: -1});
        this._drawTransformCorner(graphics, box, canvasZoom, {x: -1, y: -1});
        graphics.endFill();
    }

    private _drawTransformCorner(graphics : Graphics, box : Box2, canvasZoom : number, whichCorner : Vector) {
        let position = {
            x: box.position.x + (box.dimension.x / 2 * whichCorner.x),
            y: box.position.y + (box.dimension.y / 2 * whichCorner.y)
        };
        let cornerDimension = 6 / canvasZoom;
        drawRectangle(position, {x: cornerDimension, y: cornerDimension}, graphics);
    }

    private _keyEventToPositionAdjustment(keyCode : number) : Vector {
        let adjustment : Vector;
        if (keyCode === KeyboardCode.UP) {
            adjustment = { x: 0, y: -1 };
        } else if (keyCode === KeyboardCode.RIGHT) {
            adjustment = { x: 1, y: 0 };
        } else if (keyCode === KeyboardCode.DOWN) {
            adjustment = { x: 0, y: 1 };
        } else if (keyCode === KeyboardCode.LEFT) {
            adjustment = { x: -1, y: 0 };
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
}
