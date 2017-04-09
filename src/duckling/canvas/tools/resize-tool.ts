import {Injectable} from '@angular/core';
import {DisplayObject} from 'pixi.js';

import {newMergeKey} from '../../state';
import {Box2} from '../../math/box2';
import {EntitySystemService} from '../../entitysystem/entity-system.service';
import {Vector, vectorAdd, vectorSubtract} from '../../math/vector';
import {Entity, EntityKey} from '../../entitysystem/entity'
import {SelectionService} from '../../selection/selection.service';
import {EntityBoxService} from '../../entitysystem/services/entity-box.service';
import {AssetService} from '../../project/asset.service';
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
    private _initialEntityValue : Entity = null;

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
            return DRAG_ANCHORS.find(anchor => anchorContainsPoint(box, anchor, event.stageCoords));
        }
        return null;
    }

    onStageDown(event : CanvasMouseEvent) {
        this._initialEntityValue = this.selectedEntity;
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

    getDisplayObject(canvasZoom : number) : DisplayObject {
        let container = new PIXI.Container();
        let entityBox = this.selectedBox;
        if (entityBox) {
            for (let anchor of DRAG_ANCHORS) {
                container.addChild(drawAnchor(entityBox, anchor, canvasZoom, this._assetService));
            }
        }
        return container;
    }

    onStageMove(event : CanvasMouseEvent) {
        if (this._selectedAnchor) {
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
    }

    onStageUp(event : CanvasMouseEvent) {
        this._cancel();
    }

    onLeaveStage() {
        this._cancel();
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
        return this._entityBoxService.getEntityBox(this.selectedEntity);
    }

    get selectedEntity() : Entity | null {
        return this._selectionService.selection.value.entity;
    }

    get selectedEntityKey() : EntityKey | null {
        return this._selectionService.selection.value.selectedEntity;
    }
}
