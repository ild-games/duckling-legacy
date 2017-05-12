import {Injectable} from '@angular/core';
import {Container, DisplayObject, Graphics} from 'pixi.js';

import {MultiModeTool} from './multi-mode-tool';
import {EntityMoveTool} from './entity-move-tool';
import {EntityResizeTool} from './resize-tool';
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

    getDisplayObject(canvasZoom : number) : DisplayObject {
        let container = new Container();

        let moveToolDisplayObject = this._entityMoveTool.getDisplayObject(canvasZoom);
        if (moveToolDisplayObject) {
            container.addChild(moveToolDisplayObject);
        }

        let resizeToolDisplayObject = this._entityResizeTool.getDisplayObject(canvasZoom);
        if (resizeToolDisplayObject) {
            container.addChild(resizeToolDisplayObject);
        }

        return container;
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
