///<reference path="../../../framework/observe/Observable.ts"/>
module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    export enum DrawableType {
        Container,
        Shape,
        Image
    }

    /**
     * Represents an object that can be drawn in the game.
     */
    export class Drawable extends framework.observe.SimpleObservable {
        @ObservePrimitive(Number)
        renderPriority : number = 0;

        @ObservePrimitive(Number)
        priorityOffset : number = 0;

        @ObservePrimitive(Number)
        protected rotation : number = 0;

        @ObserveObject()
        protected positionOffset : math.Vector = new math.Vector();

        @ObservePrimitive(Boolean)
        protected inactive : boolean = false;

        @ObserveObject()
        protected scale : math.Vector = new math.Vector(1.0, 1.0);

        @ObservePrimitive()
        key : string = "";

        constructor(key : string = "") {
            super();
            this.key = key;
        }

        contains(point : math.Vector, position : math.Vector, resourceManager : util.resource.ResourceManager) {
            var canvasObj = this.getCanvasDisplayObject(resourceManager);
            if (!canvasObj) {
                return false;
            }

            canvasObj.x += position.x;
            canvasObj.y += position.y;

            var localPoint = canvasObj.globalToLocal(point.x, point.y);
            return canvasObj.hitTest(localPoint.x, localPoint.y);
        }

        getCanvasDisplayObject(resourceManager : util.resource.ResourceManager) : createjs.DisplayObject {
            return this.transformCanvasDisplayObject(this.generateCanvasDisplayObject(resourceManager));
        }

        protected generateCanvasDisplayObject(resourceManager : util.resource.ResourceManager) : createjs.DisplayObject {
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

        collectAssets() : Array<map.Asset> {
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
}
