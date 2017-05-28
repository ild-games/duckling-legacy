import {Injectable} from '@angular/core';
import {Container, DisplayObject, Graphics} from 'pixi.js';

import {DrawnConstruct} from '../drawing/drawn-construct';

import {MultiModeTool} from './multi-mode-tool';
import {EntityMoveTool, EntityMoveToolDrawnConstruct} from './entity-move-tool';
import {EntityResizeTool, ResizeToolDrawnConstruct} from './resize-tool';
import {BaseTool, CanvasMouseEvent, CanvasKeyEvent} from './base-tool';

@Injectable()
export class SelectedEntityTool extends MultiModeTool {
    private _resizing: Boolean;

    constructor(private _entityMoveTool : EntityMoveTool,
                private _entityResizeTool : EntityResizeTool) {
        super();
    }

    protected get selectedTool() {
        if (this._resizing) {
            return this._entityResizeTool;
        } else {
            return this._entityMoveTool;
        }
    }

    drawTool(canvasZoom : number) : DrawnConstruct {
        let drawnConstruct = new SelectedEntityToolDrawnConstruct();
        drawnConstruct.layer = Number.POSITIVE_INFINITY;
        drawnConstruct.moveToolConstruct = this._entityMoveTool.createDrawnConstruct(canvasZoom);
        drawnConstruct.resizeToolConstruct = this._entityResizeTool.createDrawnConstruct(canvasZoom);
        return drawnConstruct;
    }

    onStageDown(event : CanvasMouseEvent) {
        this._resizing = !!this._entityResizeTool.clickedInAnchor(event);
        super.onStageDown(event);
    }

    onStageUp(event : CanvasMouseEvent) {
        this._resizing = false;
        super.onStageUp(event);
    }

    onLeaveStage() {
        this._resizing = false;
        super.onLeaveStage();
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
}

class SelectedEntityToolDrawnConstruct extends DrawnConstruct {
    resizeToolConstruct : ResizeToolDrawnConstruct;
    moveToolConstruct : EntityMoveToolDrawnConstruct;

    drawable(totalMillis : number) : DisplayObject {
        let container = new Container();
        let resizeToolDisplayObject = this.resizeToolConstruct.drawable(totalMillis);
        if (resizeToolDisplayObject) {
            container.addChild(resizeToolDisplayObject);
        }
        let moveToolDisplayObject = this.moveToolConstruct.drawable(totalMillis);
        if (moveToolDisplayObject) {
            container.addChild(moveToolDisplayObject);
        }
        return container;
    }

    paint(graphics : Graphics) {
        this.resizeToolConstruct.paint(graphics);
        this.moveToolConstruct.paint(graphics);
    }
}