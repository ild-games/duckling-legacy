///<reference path="../../../math/Vector.ts"/>
///<reference path="Shape.ts"/>
///<reference path="../../../util/JsonLoader.ts"/>
module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    /**
     * A shape that represents a rectangle.
     */
    @serialize.ProvideClass(RectangleShape, "sf::RectangleShape")
    export class RectangleShape extends Shape {
        @observe.Object()
        dimension : math.Vector;

        constructor(dimension? : math.Vector) {
            super();
            this.dimension = dimension || new math.Vector();
        }

        public contains(point : math.Vector, shapePosition : math.Vector) {
            return  point.x > shapePosition.x - (this.dimension.x / 2) &&
                    point.x < shapePosition.x + (this.dimension.x / 2) &&
                    point.y > shapePosition.y - (this.dimension.y / 2) &&
                    point.y < shapePosition.y + (this.dimension.y / 2);
        }
    }
}
