import {Injectable} from '@angular/core';
import {DisplayObject} from 'pixi.js';

import {KeyboardService} from '../../util';

import {BaseTool, CanvasMouseEvent, CanvasKeyEvent} from './base-tool';

/**
 * A multi-mode-tool is a base class used for tools that are a composite of other
 * tools. see bimodal tool as an example.
 */
@Injectable()
export abstract class MultiModeTool extends BaseTool {
    constructor() {
        super();
    }

    protected abstract get selectedTool() : BaseTool;

    getDisplayObject(canvasZoom : number) : DisplayObject {
        if (this.selectedTool) {
            return this.selectedTool.getDisplayObject(canvasZoom);
        }
    }

    onStageDown(event : CanvasMouseEvent) {
        if (this.selectedTool) {
            return this.selectedTool.onStageDown(event);
        }
    }

    onStageMove(event : CanvasMouseEvent) {
        if (this.selectedTool) {
            this.selectedTool.onStageMove(event);
        }
    }

    onStageUp(event : CanvasMouseEvent) {
        if (this.selectedTool) {
            this.selectedTool.onStageUp(event);
        }
    }

    onKeyDown(event : CanvasKeyEvent) {
        if (this.selectedTool) {
            this.selectedTool.onKeyDown(event);
        }
    }

    onKeyUp(event : CanvasKeyEvent) {
        if (this.selectedTool) {
            this.selectedTool.onKeyUp(event);
        }
    }

    onLeaveStage() {
        if (this.selectedTool) {
            this.selectedTool.onLeaveStage();
        }
    }
}
