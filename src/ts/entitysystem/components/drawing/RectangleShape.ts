///<reference path="../../../math/Vector.ts"/>
///<reference path="Shape.ts"/>
///<reference path="../../../util/JsonLoader.ts"/>
module entityframework.components.drawing {
    /**
     * A shape that represents a rectangle.
     */
    export class RectangleShape extends Shape {
        @util.JsonKey("dimension")
        private _dimension : math.Vector;

        constructor(dimension : math.Vector) {
            super();
            this.dimension = dimension;
        }

        public contains(point : math.Vector, shapePosition : math.Vector) {
            return  point.x > shapePosition.x &&
                    point.x < shapePosition.x + this.dimension.x &&
                    point.y > shapePosition.y &&
                    point.y < shapePosition.y + this.dimension.y;
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
