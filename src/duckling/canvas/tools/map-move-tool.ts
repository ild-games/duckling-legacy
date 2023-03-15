import { Injectable } from '@angular/core';

import { Vector } from '../../math';
import { BaseTool, CanvasMouseEvent } from './base-tool';

@Injectable()
export class MapMoveTool extends BaseTool {
  private _isDown: boolean = false;
  private _curPos: Vector = { x: 0, y: 0 };

  override onStageDown(event: CanvasMouseEvent) {
    this._isDown = true;
    this._curPos = event.canvasCoords;
  }

  override onStageUp(event: CanvasMouseEvent) {
    this._isDown = false;
  }

  override onStageMove(event: CanvasMouseEvent) {
    if (this._isDown) {
      event.canvas.scrollPan({
        x: this._curPos.x - event.canvasCoords.x,
        y: this._curPos.y - event.canvasCoords.y,
      });
      this._curPos = event.canvasCoords;
    }
  }

  override get key() {
    return 'MapMoveTool';
  }

  override get label() {
    return 'Map Scroll';
  }

  override get icon() {
    return 'compass';
  }
}
