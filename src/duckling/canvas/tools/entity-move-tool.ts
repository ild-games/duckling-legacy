import {Injectable} from '@angular/core';
import {Graphics, DisplayObject} from 'pixi.js';

import {
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
import {SelectionService, Selection} from '../../selection';
import {ProjectService} from '../../project/project.service';
import {KeyboardCode} from '../../util';
import {drawRectangle} from '../drawing';
import {DrawnConstruct} from '../drawing/drawn-construct';

import {BaseTool, CanvasMouseEvent, CanvasKeyEvent} from './base-tool';
import {minCornerSnapDistance} from './_grid-snap';
import {SnapToGridService} from './grid-snap.service';

enum State {
    initial,

    shiftClickOff,
    shiftClickOnUnselected,
    shiftClickOnSelected,
    clickOff,
    clickOnUnselected,
    clickOnSelected,

    shiftClickSelectionBox,
    clickSelectionBox,

    moving,
}


@Injectable()
export class EntityMoveTool extends BaseTool {

    private _mergeKey : any;
    private _initialMouseLocation : Vector;
    private _initialPositions : {[entityKey: string]: Vector} = {};
    private _entityKeyAtMouseDownPosition : EntityKey;
    private _selectionBoxDimensions : Vector;

    private _state : State;

    constructor(private _entitySystemService : EntitySystemService,
                private _entityPositionService : EntityPositionService,
                private _selectionService : SelectionService,
                private _snapToGridService : SnapToGridService,
                private _entityBoxService : EntityBoxService,
                private _projectService : ProjectService) {
        super();
        this._state = State.initial;
    }

    drawTool(canvasZoom : number) : DrawnConstruct {
        return this.createDrawnConstruct(canvasZoom);
    }

    createDrawnConstruct(canvasZoom : number) : DrawnConstruct {
        let box = this._drawSelectionBox();
        if (!box) {
            return new DrawnConstruct();
        }

        let drawnConstruct = new EntityMoveToolDrawnConstruct(canvasZoom, box, this._drawSelectedEntityGizmos());
        drawnConstruct.layer = Number.POSITIVE_INFINITY;
        return drawnConstruct;
    }

    private _drawSelectedEntityGizmos() : Box2[] {
        let boxes : Box2[] = [];
        for (let selection of this._selectionService.selections.value) {
            let entityBox = this._entityBoxService.getEntityBox(selection.key);
            if (entityBox) {
                boxes.push(entityBox);
            }
        }
        let allEntitiesBox = this._entityBoxService.getEntitiesBoundingBox(
            this._selectionService.selections.value.map((selection: Selection) => { return selection.key; }));
        if (allEntitiesBox) {
            boxes.push(allEntitiesBox);
        }
        return boxes;
    }

    private _drawSelectionBox() : Box2 {
        if (!this._initialMouseLocation || !this._selectionBoxDimensions) {
            return;
        }

        if (this._state !== State.clickSelectionBox && this._state !== State.shiftClickSelectionBox) {
            return;
        }

        return {
            position: this._initialMouseLocation,
            dimension: this._selectionBoxDimensions,
            rotation: 0
        };
    }

    onStageDown(event : CanvasMouseEvent) {
        console.log("Initial: " + State[this._state]);
        this._mergeKey = newMergeKey();
        this._initialMouseLocation = event.stageCoords;
        
        let selectedEntityKey = this._selectionService.getEntityKeyAtPosition(event.stageCoords);

        this._setStateFromMouseDown(selectedEntityKey, event.shiftKey)

        console.log("Down: " + State[this._state]);

        switch (this._state) {
            case State.clickOnUnselected : {
                this._selectionService.deselect(this._mergeKey);
                this._selectionService.select([selectedEntityKey], this._mergeKey);
                break;                
            }
            case State.shiftClickOnUnselected: {
                this._selectionService.select([selectedEntityKey], this._mergeKey);
                break;
            }
        }
        this._cacheEntityKeyAtMouseDownPosition(selectedEntityKey);
        this._cacheInitialPositions();
    }

    private _cacheEntityKeyAtMouseDownPosition(selectedEntityKey: EntityKey) : void {
        switch (this._state) {
            case State.clickOnSelected:
            case State.clickOnUnselected:
            case State.shiftClickOnSelected:
            case State.shiftClickOnUnselected: {
                this._entityKeyAtMouseDownPosition = selectedEntityKey;
                break;
            }
        }

    }

    private _setStateFromMouseDown(selectedEntityKey: string, shiftClick: boolean): void {
        if (!selectedEntityKey) {
            if (shiftClick) {
                this._state = State.shiftClickOff;
            } else {
                this._state = State.clickOff;
            }
        } else if (this._selectionService.isSelected(selectedEntityKey)) {
            if (shiftClick) {
                this._state = State.shiftClickOnSelected;
            } else {
                this._state = State.clickOnSelected;
            }
        } else {
            if (shiftClick) {
                this._state = State.shiftClickOnUnselected;
            } else {
                this._state = State.clickOnUnselected;
            }
        }
    }

    private _cacheInitialPositions(): void {
        if (this._selectionService.selections.value.length > 0) {
            for (let selection of this._selectionService.selections.value) {
                this._initialPositions[selection.key] = this._entityPositionService.getPosition(selection.entity);
            }
        }
    }

    onStageMove(event : CanvasMouseEvent) {

        this._setStateFromMove();

        console.log("Move: " + State[this._state]);

        switch (this._state) {
            case State.clickSelectionBox:
            case State.shiftClickSelectionBox: {
                this.onStageMoveSelectionBox(event);
                break;
            }
            case State.moving: {
                this.onStageMoveSelectedEntities(event);
                break;
            }
            case State.initial: {
                this._cancel();
                return;
            }
            default: {
                throw new Error("unexpected state during stage move execution " + State[this._state]);
            }
        }
    }

    private _setStateFromMove() {
        switch (this._state) {
            case State.clickOff : {
                this._state = State.clickSelectionBox;
                break;
            }
            case State.shiftClickOff: {
                this._state = State.shiftClickSelectionBox;
                break;
            }
            case State.clickOnSelected:
            case State.clickOnUnselected:
            case State.shiftClickOnSelected:
            case State.shiftClickOnUnselected: {
                this._state = State.moving;
                break;
            }
            case State.clickSelectionBox:
            case State.initial:
            case State.shiftClickSelectionBox:
            case State.moving: {
                break;
            }
        }
    }

    onStageMoveSelectionBox(event : CanvasMouseEvent) {
        this._selectionBoxDimensions = vectorSubtract(event.stageCoords, this._initialMouseLocation);
    }
    
    onStageMoveSelectedEntities(event : CanvasMouseEvent) {
        if (!this._selectionService.selections.value || this._selectionService.selections.value.length === 0 || !this._initialMouseLocation) {
            return;
        }
        
        let dragDistance = vectorSubtract(event.stageCoords, this._initialMouseLocation);

        if (this._snapToGridService.shouldSnapToGrid(event)) {
            dragDistance = this._getDragDistanceWithSnapping(dragDistance);
        }

        for (let selection of this._selectionService.selections.value) {
            let updatedEntity = this._entityPositionService.setPosition(selection.entity, vectorAdd(dragDistance, this._initialPositions[selection.key]));
            this._entitySystemService.updateEntity(selection.key, updatedEntity, this._mergeKey);
        }
    }

    private _getDragDistanceWithSnapping(dragDistance: Vector): Vector {
        let initialBox = this._entityBoxService.getEntityBox(this._entityKeyAtMouseDownPosition);
        let destination = vectorAdd(initialBox.position, dragDistance);
        let snappedDestination = this._snapToGridService.snapBox(destination, initialBox);
        dragDistance = vectorSubtract(snappedDestination, initialBox.position);
        return dragDistance;
    }

    onStageUp(event : CanvasMouseEvent) {

        console.log("Up: " + State[this._state]);
        switch (this._state) {
            case State.clickOff: {
                this._selectionService.deselect(this._mergeKey);
                break;
            }
            case State.clickOnSelected: {
                this._selectionService.deselect(this._mergeKey);
                let entityKey = this._selectionService.getEntityKeyAtPosition(event.stageCoords);
                this._selectionService.select([entityKey], this._mergeKey);
                break;
            }

            case State.shiftClickOnSelected: {
                let entityKey = this._selectionService.getEntityKeyAtPosition(event.stageCoords);
                this.removeEntityFromSelection(entityKey)
                break;
            }

            case State.clickSelectionBox : {
                this._selectionService.deselect(this._mergeKey);
                this.selectEntitiesInSelectionBox();
                break;
            }

            case State.shiftClickSelectionBox : {
                this.selectEntitiesInSelectionBox();
                break;
            }
            case State.initial: {
                this._cancel();
                return;
            }
            case State.moving:
            case State.shiftClickOff: 
            case State.clickOnUnselected:
            case State.shiftClickOnUnselected: {
                break;
            }
        }
        this._cancel();
    }

    selectEntitiesInSelectionBox() {
        let entityKeys = this._selectionService.getEntityKeysAtArea(this._initialMouseLocation, this._selectionBoxDimensions);
        if (!entityKeys || entityKeys.length === 0) {
            return;
        }
        
        this._selectionService.select(entityKeys, this._mergeKey);
    }

    removeEntityFromSelection(selectedEntityKey : string) {
        
        if (selectedEntityKey) {
            let newSelections = this._selectionService.selections.value.filter(selection => selection.key !== selectedEntityKey);
            this._selectionService.deselect(this._mergeKey);
            this._selectionService.select(newSelections.map(selection => selection.key), this._mergeKey);
        }
    }

    onKeyDown(event : CanvasKeyEvent) {
        if (!this._selectionService.selections.value || this._selectionService.selections.value.length <= 0) {
            return;
        }

        if (this._isMovementKey(event.keyCode)) {
            this._adjustEntityPosition(this._keyEventToPositionAdjustment(event));
        } else if (this._isDeleteKey(event.keyCode)) {
            this._deleteSelectedEntities();
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
        for (let selection of this._selectionService.selections.value) {
            let oldPosition = this._entityPositionService.getPosition(selection.entity);
            let updatedEntity = this._entityPositionService.setPosition(selection.entity, vectorAdd(oldPosition, adjustment));
            this._entitySystemService.updateEntity(selection.key, updatedEntity);
        }
    }

    private _deleteSelectedEntities() {
        let mergeKey = newMergeKey();
        for (let selection of this._selectionService.selections.value) {
            let entityKey = selection.key;
            this._selectionService.deselect(mergeKey);
            this._entitySystemService.deleteEntity(entityKey, mergeKey);
        }
    }

    private _cancel() {
        this._mergeKey = null;
        this._initialMouseLocation = null;
        this._initialPositions = {};
        this._state = State.initial;
        this._selectionBoxDimensions = null;
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

export class EntityMoveToolDrawnConstruct extends DrawnConstruct {
    constructor(private _canvasZoom : number,
                private _box : Box2,
                private _selectedEntityGizmos : Box2[]) {
        super();
    }

    paint(graphics : Graphics) {
        if (!this._box) {
            return;
        }

        for (let gizmo of this._selectedEntityGizmos) {
            graphics.lineStyle(1 / this._canvasZoom, 0x3355cc, 1);
            drawRectangle(gizmo.position, gizmo.dimension, graphics);
        }
        graphics.lineStyle(1 / this._canvasZoom, 0x3355cc, 1);
        drawRectangle(this._box.position, this._box.dimension, graphics);
    }
}