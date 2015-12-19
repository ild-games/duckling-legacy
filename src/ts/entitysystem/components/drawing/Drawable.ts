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
        @observe.Primitive(Number)
        protected renderPriority : number = 0;

        @observe.Primitive(Number)
        protected priorityOffset : number = 0;

        @observe.Primitive(Number)
        protected rotation : number = 0;

        @observe.Object()
        protected positionOffset : math.Vector = new math.Vector();

        @observe.Primitive(Boolean)
        protected inactive : boolean = false;

        @observe.Object()
        protected scale : math.Vector = new math.Vector(1.0, 1.0);

        @observe.Primitive()
        key : string = "";

        constructor(key : string = "") {
            super();
            this.key = key;
        }

        contains(point : math.Vector, position : math.Vector) {
            var canvasObj = this.getCanvasDisplayObject(position);
            canvasObj.x = position.x;
            canvasObj.y = position.y;
            var localPoint = canvasObj.globalToLocal(point.x, point.y);
            return canvasObj.hitTest(localPoint.x, localPoint.y);
        }

        getCanvasDisplayObject(position : math.Vector) : createjs.DisplayObject {
            return this.transformCanvasDisplayObject(
                this.generateCanvasDisplayObject(position),
                position);
        }

        protected generateCanvasDisplayObject(position : math.Vector) : createjs.DisplayObject {
            throw new Error("This method is abstract");
        }

        private transformCanvasDisplayObject(displayObj : createjs.DisplayObject, position : math.Vector) : createjs.DisplayObject {
            if (displayObj) {
                displayObj.x += this.positionOffset.x;
                displayObj.y += this.positionOffset.y;
                displayObj.scaleX = this.scale.x;
                displayObj.scaleY = this.scale.y;
                displayObj.rotation = this.rotation;
            }
            return displayObj;
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
