import {Injectable} from '@angular/core';
import {DisplayObject} from 'pixi.js';

import {KeyboardService} from '../../util';

import {BaseTool, CanvasMouseEvent, CanvasKeyEvent} from './base-tool';

/**
 * A bimodal tool manages a primary tool and a secondary tool that is activated whenever
 * the spacebar is held.
 */
@Injectable()
export class BimodalTool extends BaseTool {

    constructor(private _primaryTool : BaseTool,
                private _secondaryTool : BaseTool,
                private _keyboardService : KeyboardService) {
        super();
    }

    getDisplayObject(canvasZoom : number) : DisplayObject {
        return this._selectedTool.getDisplayObject(canvasZoom);
    }

    onStageDown(event : CanvasMouseEvent) {
        this._selectedTool.onStageDown(event);
    }

    onStageMove(event : CanvasMouseEvent) {
        this._selectedTool.onStageMove(event);
    }

    onStageUp(event : CanvasMouseEvent) {
        this._selectedTool.onStageUp(event);
    }

    onKeyDown(event : CanvasKeyEvent) {
        this._selectedTool.onKeyDown(event);
    }

    onKeyUp(event : CanvasKeyEvent) {
        this._selectedTool.onKeyUp(event);
    }

    onLeaveStage() {
        this._selectedTool.onLeaveStage();
    }

    private get _selectedTool() {
        if (!this._isSpacePressed()) {
            return this._primaryTool;
        } else {
            return this._secondaryTool;
        }
    }

    private _isSpacePressed() {
        return this._keyboardService.isKeyDown(32);
    }

    get key() {
        return this._primaryTool.key;
    }

    get label() {
        return this._primaryTool.label;
    }

    get icon() {
        return this._primaryTool.icon;
    }
}
