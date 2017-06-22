import {Injectable} from '@angular/core';
import {Subscriber, BehaviorSubject, Observable} from 'rxjs';
import {DisplayObject} from 'pixi.js';

import {KeyboardService} from '../../util';

import {BaseTool, CanvasMouseEvent, CanvasKeyEvent} from './base-tool';
import {MultiModeTool} from './multi-mode-tool';

/**
 * A bimodal tool manages a primary tool and a secondary tool that is activated whenever
 * the spacebar is held.
 */
@Injectable()
export class BimodalTool extends MultiModeTool {
    constructor(private _primaryTool : BaseTool,
                private _secondaryTool : BaseTool,
                private _keyboardService : KeyboardService) {
        super();

        this.drawnConstructChanged = Observable.merge(
            this._primaryTool.drawnConstructChanged, 
            this._secondaryTool.drawnConstructChanged
        ) as BehaviorSubject<boolean>;
    }

    protected get selectedTool() {
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
