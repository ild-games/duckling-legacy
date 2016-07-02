import {DisplayObject} from 'pixi.js';

import {Vector} from '../../math';

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

export class CanvasMouseEvent {
    canvasCoords : Vector;
    stageCoords : Vector;
}
