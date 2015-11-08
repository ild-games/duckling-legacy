module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    /**
     *  Model object describing a shape.
     */
    export class Shape extends framework.observe.Observable {
        @observe.Object()
        fillColor : Color;

        constructor(fillColor? : Color) {
            super();
            this.fillColor = fillColor || new Color(0, 0, 0, 255);
        }

        getDrawable(position : math.Vector) : createjs.DisplayObject {
            throw new Error("This method is abstract");
        }

        @serialize.Ignore
        get type() : ShapeType {
            throw new Error("This method is abstract");
        }

        @serialize.Ignore
        get factory() : ShapeFactory {
            return ShapeTypeToFactory[ShapeType[this.type]];
        }
    }
}
