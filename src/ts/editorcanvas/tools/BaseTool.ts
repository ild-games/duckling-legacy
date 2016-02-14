import Context from '../../framework/context/Context';
import CanvasVM from '../CanvasVM';
import Vector from '../../math/Vector';
import Tool from './Tool';

export default class BaseTool implements Tool {
    protected context : Context;

    onBind(context : Context) {
        this.context = context;
    }

    getDisplayObject() : createjs.DisplayObject {
        return null;
    }

    onEvent(event, canvas : CanvasVM) {
        switch (event.type) {
            case "click":
                if (event.nativeEvent.button === 0) {
                    this.onLeftClick(new Vector(event.stageX, event.stageY), canvas);
                }
                break;
            case "stagemousedown":
                this.onStageDown(new Vector(event.stageX, event.stageY), canvas);
                break;
            case "stagemouseup":
                this.onStageUp(new Vector(event.stageX, event.stageY), canvas);
                break;
            case "stagemousemove":
                this.onStageMove(new Vector(event.stageX, event.stageY), canvas);
                break;
        }
    }

    onLeftClick(position : Vector, canvas : CanvasVM) {
    }

    onStageDown(position : Vector, canvas : CanvasVM) {
    }

    onStageUp(position : Vector, canvas : CanvasVM) {
    }

    onStageMove(position : Vector, canvas : CanvasVM) {
    }

    get key() : string {
        throw new Error("Not yet implemented");
    }

    get label() : string {
        throw new Error("Not yet implemented");
    }
}
