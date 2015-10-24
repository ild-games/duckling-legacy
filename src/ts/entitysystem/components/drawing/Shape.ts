module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    /**
     *  Model object describing a shape.
     */
    export class Shape extends framework.observe.Observable {
        @observe.Object()
        fillColor : Color = new Color(0, 0, 0, 255);

        public contains(point : math.Vector, shapePosition : math.Vector) {
            throw new Error("This method is abstract");
        }
    }
}
