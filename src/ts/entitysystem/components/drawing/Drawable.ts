import {ObserveObject, ObservePrimitive} from '../../../framework/observe/ObserveDecorators';
import SimpleObservable from '../../../framework/observe/SimpleObservable';
import Vector from '../../../math/Vector';
import * as serialize from '../../../util/serialize/Decorators';
import {Asset} from '../../core/Map';
import ResourceManager from '../../ResourceManager';
import DrawableType from './DrawableType';
import DrawableFactory from './DrawableFactory';
import DrawableTypeToFactory from './DrawableTypeToFactory';

/**
 * Represents an object that can be drawn in the game.
 */
export default class Drawable extends SimpleObservable {
    @ObservePrimitive(Number)
    renderPriority : number = 0;

    @ObservePrimitive(Number)
    priorityOffset : number = 0;

    @ObservePrimitive(Number)
    protected rotation : number = 0;

    @ObserveObject()
    protected positionOffset : Vector = new Vector();

    @ObservePrimitive(Boolean)
    protected inactive : boolean = false;

    @ObserveObject()
    protected scale : Vector = new Vector(1.0, 1.0);

    @ObservePrimitive()
    key : string = "";

    constructor(key : string = "") {
        super();
        this.key = key;
    }

    contains(point : Vector, position : Vector, resourceManager : ResourceManager) {
        var canvasObj = this.getCanvasDisplayObject(resourceManager);
        if (!canvasObj) {
            return false;
        }

        canvasObj.x += position.x;
        canvasObj.y += position.y;

        var localPoint = canvasObj.globalToLocal(point.x, point.y);
        return canvasObj.hitTest(localPoint.x, localPoint.y);
    }

    getCanvasDisplayObject(resourceManager : ResourceManager) : createjs.DisplayObject {
        return this.transformCanvasDisplayObject(this.generateCanvasDisplayObject(resourceManager));
    }

    protected generateCanvasDisplayObject(resourceManager : ResourceManager) : createjs.DisplayObject {
        throw new Error("This method is abstract");
    }

    private transformCanvasDisplayObject(displayObj : createjs.DisplayObject) : createjs.DisplayObject {
        if (displayObj) {
            displayObj.x += this.positionOffset.x;
            displayObj.y += this.positionOffset.y;
            displayObj.scaleX = this.scale.x;
            displayObj.scaleY = this.scale.y;
            displayObj.rotation += this.rotation;
        }
        return displayObj;
    }

    collectAssets() : Array<Asset> {
        return [];
    }

    @serialize.Ignore
    get type() : DrawableType {
        throw new Error("This method is abstract");
    }

    @serialize.Ignore
    get factory() : DrawableFactory {
        return DrawableTypeToFactory[DrawableType[this.type]];
    }
}
