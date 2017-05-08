import {Injectable} from '@angular/core';
import {DisplayObject, Container} from 'pixi.js';

import {newMergeKey} from '../../state';
import {Box2} from '../../math/box2';
import {EntitySystemService} from '../../entitysystem/entity-system.service';
import {Vector, vectorAdd, vectorSubtract} from '../../math/vector';
import {Entity, EntityKey} from '../../entitysystem/entity'
import {SelectionService} from '../../selection/selection.service';
import {EntityBoxService} from '../../entitysystem/services/entity-box.service';
import {AssetService} from '../../project/asset.service';
import {DrawnConstruct} from '../drawing/drawn-construct';
import {SnapToGridService} from './grid-snap.service';
import {BaseTool, CanvasMouseEvent, CanvasKeyEvent} from './base-tool';
import {DRAG_ANCHORS, drawAnchor, DragAnchor, anchorContainsPoint, getResizeFromDrag, getAnchorPosition} from './drag-anchor';
import {minCornerSnapDistance} from './_grid-snap';

@Injectable()
export class EntityResizeTool extends BaseTool {
    private _mergeKey : any;
    private _selectedAnchor : DragAnchor = null;
    private _mouseDownLocation : Vector = null;
    private _initialEntityBox : Box2 = null;
    private _positionOffset : Vector = null;
    private _initialEntityValue : EntityKey = null;

    constructor(private _selectionService: SelectionService,
                private _entitySystemService : EntitySystemService,
                private _snapToGrid : SnapToGridService,
                private _assetService : AssetService,
                private _entityBoxService : EntityBoxService) {
        super();
    }

    clickedInAnchor(event : CanvasMouseEvent) : DragAnchor {
        let box = this.selectedBox;
        if (box) {
            return DRAG_ANCHORS.find(anchor => anchorContainsPoint(box, anchor, event.stageCoords, event.canvas.scale));
        }
        return null;
    }

    onStageDown(event : CanvasMouseEvent) {
        if (!this._onlyOneSelectedEntity()) {
            return;
        }
        
        this._initialEntityValue = this.selectedEntityKey;
        this._initialEntityBox = this.selectedBox;
        this._mergeKey = newMergeKey();

        if (this._initialEntityBox) {
            this._selectedAnchor = this.clickedInAnchor(event);
        } else {
            this._selectedAnchor = null;
        }

        if (this._selectedAnchor) {
            this._positionOffset = vectorSubtract(getAnchorPosition(this._initialEntityBox, this._selectedAnchor), event.stageCoords);
            this._mouseDownLocation = vectorAdd(event.stageCoords, this._positionOffset);
        }
    }

    drawTool(canvasZoom : number) : DrawnConstruct {
        return this.createDrawnConstruct(canvasZoom);
    }

    createDrawnConstruct(canvasZoom : number) : DrawnConstruct {
        let entityBox = this.selectedBox;
        if (!entityBox) {
            return new DrawnConstruct();
        }
        let drawnAnchors : DisplayObject[] = [];
        for (let anchor of DRAG_ANCHORS) {
            drawnAnchors.push(drawAnchor(entityBox, anchor, canvasZoom, this._assetService));
        }

        let drawnConstruct = new ResizeToolDrawnConstruct(drawnAnchors);
        drawnConstruct.layer = Number.POSITIVE_INFINITY;
        return drawnConstruct;
    }

    onStageMove(event : CanvasMouseEvent) {
        if (!this._selectedAnchor) {
            return;
        }
        
        let mouseLocation = vectorAdd(event.stageCoords, this._positionOffset);
        if (this._snapToGrid.shouldSnapToGrid(event)) {
            mouseLocation = this._snapToGrid.snapPosition(mouseLocation);
        }

        let newBox = getResizeFromDrag(this._initialEntityBox, this._selectedAnchor, this._mouseDownLocation, mouseLocation);

        if (newBox.dimension.x > 0 && newBox.dimension.y > 0) {
            let updatedEntity = this._entityBoxService.setEntityBox(this._initialEntityValue, newBox);
            this._entitySystemService.updateEntity(this.selectedEntityKey, updatedEntity, this._mergeKey);
        }
    }

    onStageUp(event : CanvasMouseEvent) {
        this._cancel();
    }

    onLeaveStage() {
        this._cancel();
    }
   
    private _onlyOneSelectedEntity() : boolean {
        return (this._selectionService.selections.value && this._selectionService.selections.value.length === 1);
    }

    private _shouldSnapToGrid(event : CanvasMouseEvent) {
        return !event.shiftKey;
    }

    private _cancel() {
        this._selectedAnchor = null;
        this._mouseDownLocation = null;
        this._initialEntityBox = null;
        this._positionOffset = null;
    }

    get selectedBox() : Box2 {
        return this._entityBoxService.getEntityBox(this.selectedEntityKey);
    }

    get selectedEntity() : Entity | null {
        if (!this._selectionService.selections.value || this._selectionService.selections.value.length < 1) {
            return null;
        }
        return this._selectionService.selections.value[0].entity;
    }

    get selectedEntityKey() : EntityKey | null {
        if (!this._selectionService.selections.value || this._selectionService.selections.value.length < 1) {
            return null;
        }
        return this._selectionService.selections.value[0].key;
    }
}

export class ResizeToolDrawnConstruct extends DrawnConstruct {
    private _container = new Container();

    constructor(private _anchorDisplayObjects : DisplayObject[]) {
        super();
        for (let anchor of this._anchorDisplayObjects) {
            this._container.addChild(anchor);
        }
    }

    draw(totalMillis : number) {
        return this._container;
    }
}