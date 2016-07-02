import {DisplayObject} from 'pixi.js';

import {Vector} from '../../math';
import {Canvas} from '../canvas.component';

export class BaseTool {

    getDisplayObject() : DisplayObject {
        return null;
    }

    onStageDown(event : CanvasMouseEvent) {

    }

    onStageUp(event : CanvasMouseEvent) {

    }

    onStageMove(event : CanvasMouseEvent) {

    }

    onLeaveStage() {

    }

    get key() : string {
        throw new Error("Not yet implemented");
    }

    get label() : string {
        throw new Error("Not yet implemented");
    }

    get icon() : string {
        throw new Error("Not yet implemented");
    }
}

/**
 * Event describing a mouse action on the canvas
 */
export class CanvasMouseEvent {
    /**
     * Coordinate of the mouse event in respect to the canvas element
     */
    canvasCoords : Vector;

    /**
     * Coordinate of the mouse event in respect to the virtual stage
     */
    stageCoords : Vector;

    /**
     * Canvas component the event came from
     */
    canvas : Canvas;
}
