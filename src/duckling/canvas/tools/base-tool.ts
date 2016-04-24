import {DisplayObject} from 'pixi.js';

import {Vector} from '../../math';

export class BaseTool {

    getDisplayObject() : DisplayObject {
        return null;
    }

    onLeftClick(position : Vector) {
    }

    onStageDown(position : Vector) {
    }

    onStageUp(position : Vector) {
    }

    onStageMove(position : Vector) {
    }

    get key() : string {
        throw new Error("Not yet implemented");
    }

    get label() : string {
        throw new Error("Not yet implemented");
    }
}
