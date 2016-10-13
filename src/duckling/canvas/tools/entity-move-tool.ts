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
import {EntityEligibleResizeService} from '../../entitysystem/services/entity-eligible-resize.service';
import {EntitySizeService, SizeAttributeMap} from '../../entitysystem/services/entity-size.service';
import {Box2, Vector, vectorMultiply, vectorAdd, vectorSubtract, vectorRound, boxContainsPoint} from '../../math';
import {newMergeKey} from '../../state';
import {SelectionService} from '../../selection';
import {KeyboardCode} from '../../util';
import {drawRectangle} from '../drawing';


import {BaseTool, CanvasMouseEvent, CanvasKeyEvent} from './base-tool';

@Injectable()
export class EntityMoveTool extends BaseTool {
    private _selection : EntityKey;
    private _selectedCorner : Vector = null;
    private _entitySizeAttributeMap : SizeAttributeMap = null;
    private _selectedCornerFirstCoords : Vector = null;
    private _mergeKey : any;
    private _selectOffsetCoords : Vector = {x: 0, y: 0};

    constructor(private _entitySelectionService: EntitySelectionService,
                private _entitySystemService : EntitySystemService,
                private _entityPositionService : EntityPositionService,
                private _selectionService : SelectionService,
                private _entityEligibleForResizeService : EntityEligibleResizeService,
                private _entitySizeService : EntitySizeService,
                private _entityBoxService : EntityBoxService) {
        super();
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

    getDisplayObject(scale : number) : DisplayObject {
        return this._buildSelectionBox(scale);
    }

    onStageDown(event : CanvasMouseEvent) {
        let whichCorner = this._isCornerClicked(event.stageCoords, event.canvas.scale);
        let selectedEntity = this._entityAlreadySelected();
        if (selectedEntity && whichCorner && this._entityEligibleForResizeService.isEntityResizable(selectedEntity)) {
            this._cornerClicked(whichCorner, event.stageCoords);
        } else {
            this._tryEntitySelect(event.stageCoords);
        }
    }

    onStageMove(event : CanvasMouseEvent) {
        if (this._selection) {
            this._entityPositionService.setPosition(
                this._selection,
                vectorRound(vectorAdd(event.stageCoords, this._selectOffsetCoords)),
                this._mergeKey);
        } else if (this._selectedCorner) {
            this._processCornerResize(event.stageCoords);
        }
    }

    onStageUp(event : CanvasMouseEvent) {
        this._cancel();
    }

    onKeyDown(event : CanvasKeyEvent) {
        if (this._entityAlreadySelected() && this._isMovementKey(event.keyCode)) {
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

    private _processCornerResize(currentCoords : Vector) {
        let selectedEntityKey = this._selectionService.selection.value.selectedEntity;
        if (!selectedEntityKey) {
            return;
        }

        let anchorCorner = this._getAnchorCorner(this._selectedCorner);
        this._entitySizeService.setSize(
            selectedEntityKey,
            this._getNewSizeAttributeMap(currentCoords),
            this._mergeKey);
    }

    private _getNewSizeAttributeMap(currentCoords : Vector) : SizeAttributeMap {
        let newSizeAttributeMap : SizeAttributeMap = {};
        for (let key in this._entitySizeAttributeMap) {
            let coordsOffset = vectorSubtract(currentCoords, this._selectedCornerFirstCoords);
            newSizeAttributeMap[key] = vectorAdd(
                this._entitySizeAttributeMap[key],
                vectorMultiply(coordsOffset, {x: 2, y: 2}));
        }
        return newSizeAttributeMap;
    }

    private _getAnchorCorner(corner : Vector) : Vector {
        return vectorMultiply(corner, {x: -1, y: -1});
    }

    private _entityAlreadySelected() {
        return this._selectionService.selection.value.entity;
    }

    private _isCornerClicked(clickedCoords : Vector, scale : number) : Vector {
        let selectedEntity = this._selectionService.selection.value.entity;
        if (!selectedEntity) {
            return;
        }

        let clicked : Vector = null;
        let box = this._entityBoxService.getEntityBox(selectedEntity);
        for (let whichCorner of this._whichCorners) {
            let cornerBox = this._buildTransformCornerBox(box, scale, whichCorner);
            if (!clicked && boxContainsPoint(cornerBox, clickedCoords)) {
                clicked = whichCorner;
            }
        }
        return clicked;
    }

    private _cornerClicked(whichCorner : Vector, clickedCoords : Vector) {
        this._selectedCorner = whichCorner;
        this._selectedCornerFirstCoords = clickedCoords;
        this._mergeKey = newMergeKey();
        this._entitySizeAttributeMap = this._entitySizeService.getSize(
            this._selectionService.selection.value.selectedEntity,
            this._mergeKey);
    }

    private _tryEntitySelect(clickedCoords : Vector) {
        this._selection = this._entitySelectionService.getEntityKey(clickedCoords);
        this._selectOffsetCoords = {x: 0, y: 0};
        if (this._selection) {
            let position = this._entityPositionService.getPosition(this._selection);
            this._selectOffsetCoords = vectorSubtract(position, clickedCoords);
        }
        this._mergeKey = newMergeKey();
        this._selectionService.select(this._selection, this._mergeKey);
    }

    private _cancel() {
        this._selection = null;
        this._selectedCorner = null;
        this._selectedCornerFirstCoords = null;
        this._entitySizeAttributeMap = null;
    }

    private _buildSelectionBox(scale : number) : DisplayObject {
        let graphics : Graphics = null;
        let selectedEntityKey = this._selectionService.selection.value.selectedEntity;
        let selectedEntity = this._entitySystemService.getEntity(selectedEntityKey);
        if (selectedEntity) {
            graphics = this._buildSelectionBoxAroundEntity(selectedEntity, scale);
        }
        return graphics;
    }

    private _buildSelectionBoxAroundEntity(entity : Entity, scale : number) : Graphics {
        let graphics : Graphics = null;
        let box = this._entityBoxService.getEntityBox(entity);
        if (box) {
            graphics = new Graphics();
            graphics.lineStyle(1 / scale, 0x3355cc, 1);
            drawRectangle(box.position, box.dimension, graphics);
            if (this._entityEligibleForResizeService.isEntityResizable(entity)) {
                this._drawTransformCorners(graphics, box, scale);
            }
        }
        return graphics;
    }

    private _drawTransformCorners(graphics : Graphics, box : Box2, scale : number) {
        graphics.lineStyle(1 / scale, 0x000000, 1);
        graphics.beginFill(0x000000, 1);
        for (let whichCorner of this._whichCorners) {
            this._drawTransformCorner(graphics, box, scale, whichCorner);
        }
        graphics.endFill();
    }

    private get _whichCorners() : Vector[] {
        return [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}];
    }

    private _drawTransformCorner(graphics : Graphics, box : Box2, scale : number, whichCorner : Vector) {
        let cornerBox = this._buildTransformCornerBox(box, scale, whichCorner);
        drawRectangle(cornerBox.position, cornerBox.dimension, graphics);
    }

    private _buildTransformCornerBox(entitySelectionBox : Box2, scale : number, whichCorner : Vector) : Box2 {
        let position = {
            x: entitySelectionBox.position.x + (entitySelectionBox.dimension.x / 2 * whichCorner.x),
            y: entitySelectionBox.position.y + (entitySelectionBox.dimension.y / 2 * whichCorner.y)
        };
        let cornerDimension = 6 / scale;
        return {
            position: position,
            dimension: {x: cornerDimension, y: cornerDimension},
            rotation: 0
        };
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
