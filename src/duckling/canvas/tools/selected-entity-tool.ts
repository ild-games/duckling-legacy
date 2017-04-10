import {Injectable} from '@angular/core';
import {Container, DisplayObject} from 'pixi.js';

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
        container.addChild(this._entityMoveTool.getDisplayObject(canvasZoom));
        container.addChild(this._entityResizeTool.getDisplayObject(canvasZoom));
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
