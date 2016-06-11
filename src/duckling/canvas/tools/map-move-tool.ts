import {Injectable} from 'angular2/core';

import {Vector} from '../../math';
import {BaseTool} from './base-tool';

@Injectable()
export class MapMoveTool extends BaseTool {
    private _isDown : boolean = false;
    private _curPos : Vector = {x: 0, y: 0};
    private _offset : Vector;
    draggedElement : HTMLElement = null;

    onStageDown(canvasCoords : Vector, stageCoords : Vector) {
        this._isDown = true;
        this._curPos = canvasCoords;
        if (this.draggedElement) {
            this._offset = {x: this.draggedElement.scrollLeft, y: this.draggedElement.scrollTop};
        }
    }

    onStageUp(canvasCoords : Vector, stageCoords : Vector) {
        this._isDown = false;
    }

    onStageMove(canvasCoords : Vector, stageCoords : Vector) {
        if (this._isDown && this.draggedElement) {
            var scrollToX = this._offset.x + (this._curPos.x - canvasCoords.x);
            var scrollToY = this._offset.y + (this._curPos.y - canvasCoords.y);

            this.draggedElement.scrollLeft = scrollToX;
            this.draggedElement.scrollTop = scrollToY;
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
