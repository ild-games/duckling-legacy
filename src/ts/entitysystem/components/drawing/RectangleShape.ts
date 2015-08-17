///<reference path="../../../math/Vector.ts"/>
///<reference path="Shape.ts"/>
///<reference path="../../../util/JsonLoader.ts"/>
module entityframework.components.drawing {

    import serialize = util.serialize;

    /**
     * A shape that represents a rectangle.
     */
    @serialize.ProvideClass(RectangleShape, "sf::RectangleShape")
    export class RectangleShape extends Shape {
        @serialize.Key("dimension")
        private _dimension : math.Vector;

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

        public get dimension():math.Vector {
            return this._dimension;
        }

        public set dimension(value:math.Vector) {
            if (this._dimension) {
                this._dimension.stopListening("dimension", this);
            }

            this._dimension = value;

            if (value) {
                this._dimension.listenForChanges("dimension", this);
            }
        }
    }
}
