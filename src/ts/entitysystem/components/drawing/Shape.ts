module entityframework.components.drawing {

    /**
     *  Model object describing a shape.
     */
    export class Shape extends framework.observe.Observable {
        public contains(point : math.Vector, shapePosition : math.Vector) {
            throw new Error("This method is abstract");
        }
    }
}
