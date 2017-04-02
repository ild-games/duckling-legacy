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
import {DRAG_ANCHORS, drawAnchor, DragAnchor, anchorContainsPoint, getResizeFromDrag} from './drag-anchor';

import {EntityMoveTool} from './entity-move-tool';
import {EntityResizeTool} from './resize-tool';


@Injectable()
export class SelectedEntityTool extends BaseTool {
    private _activeTool : BaseTool;

    constructor(private _entityMoveTool : EntityMoveTool,
                private _entityResizeTool : EntityResizeTool) {
        super();
    }

    getDisplayObject(canvasZoom : number) : DisplayObject {
        let container = new PIXI.Container();
        container.addChild(this._entityMoveTool.getDisplayObject(canvasZoom));
        container.addChild(this._entityResizeTool.getDisplayObject(canvasZoom));
        return container;
    }

    onStageDown(event : CanvasMouseEvent) {
        if (this._entityResizeTool.onStageDown(event)) {
            this._activeTool = this._entityResizeTool;
        } else if (this._entityMoveTool.onStageDown(event)) {
            this._activeTool = this._entityMoveTool;
        } else {
            this._activeTool = null;
        }
        return this._activeTool !== null;
    }

    onStageMove(event : CanvasMouseEvent) {
        if (this._activeTool) {
            this._activeTool.onStageMove(event);
        }
    }

    onStageUp(event : CanvasMouseEvent) {
        if (this._activeTool) {
            this._activeTool.onStageUp(event);
        }
        this._cancel();
    }

    onKeyDown(event : CanvasKeyEvent) {
        if (this._activeTool !== this._entityResizeTool) {
            this._entityMoveTool.onKeyDown(event);
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
        this._activeTool = null;
    }
}
