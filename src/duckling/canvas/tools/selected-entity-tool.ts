import {Injectable} from '@angular/core';
import {Container, DisplayObject, Graphics} from 'pixi.js';

import {DrawnConstruct, PainterFunction, DrawableFunction} from '../drawing/drawn-construct';

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

    drawTool(canvasZoom : number) : DrawnConstruct {
        let drawnConstruct = new DrawnConstruct();
        drawnConstruct.layer = Number.POSITIVE_INFINITY;
        drawnConstruct.painter = this._painter(canvasZoom);
        drawnConstruct.drawable = this._drawable(canvasZoom);
        return drawnConstruct;
    }

    private _painter(canvasZoom : number) : PainterFunction {
        return (graphics : Graphics) => {
            let movePainter = this._entityMoveTool.painter(canvasZoom);
            if (movePainter) {
                movePainter(graphics);
            }
            let resizePainter = this._entityResizeTool.painter(canvasZoom);
            if (resizePainter) {
                resizePainter(graphics);
            }
        };
    }

    private _drawable(canvasZoom : number) : DrawableFunction {
        let moveDrawable = this._entityMoveTool.drawable(canvasZoom);
        let resizeDrawable = this._entityResizeTool.drawable(canvasZoom);

        return () => {
            let container = new Container();
            if (moveDrawable) {
                container.addChild(moveDrawable());
            }
            if (resizeDrawable) {
                container.addChild(resizeDrawable());
            }
            return container;
        }
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
