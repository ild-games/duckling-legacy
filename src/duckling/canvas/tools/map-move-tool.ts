import {Injectable} from '@angular/core';

import {Vector} from '../../math';
import {BaseTool, CanvasMouseEvent} from './base-tool';

@Injectable()
export class MapMoveTool extends BaseTool {
    private _isDown : boolean = false;
    private _curPos : Vector = {x: 0, y: 0};
    private _offset : Vector;

    onStageDown(event : CanvasMouseEvent) {
        this._isDown = true;
        this._curPos = event.canvasCoords;
        this._offset = event.canvas.scrollPosition;
    }

    onStageUp(event : CanvasMouseEvent) {
        this._isDown = false;
    }

    onStageMove(event : CanvasMouseEvent) {
        if (this._isDown) {
            event.canvas.scrollTo({
                x: this._offset.x + (this._curPos.x - event.canvasCoords.x),
                y: this._offset.y + (this._curPos.y - event.canvasCoords.y)
            });
        }
    }

    get key() {
        return "MapMoveTool";
    }

    get label() {
        return "Map Scroll";
    }

    get icon() {
        return "compass";
    }
}
