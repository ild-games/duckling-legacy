import {DisplayObject} from 'pixi.js';

import {Vector} from '../../math';

export class BaseTool {

    getDisplayObject() : DisplayObject {
        return null;
    }

    onStageDown(canvasCoords : Vector, stageCoords : Vector) {

    }

    onStageUp(canvasCoords : Vector, stageCoords : Vector) {

    }

    onStageMove(canvasCoords : Vector, stageCoords : Vector) {

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
        throw new Error("");
    }
}
