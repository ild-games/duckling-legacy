module entityframework.components.drawing {

    /**
     * Represents a shape that can be drawn in the game.
     */
    export class ShapeDrawable extends Drawable {
        private _shape : Shape;

        constructor(shape : entityframework.components.drawing.Shape) {
            super();
            this.shape = shape;
        }

        //region Getters and Setters
        public get shape():entityframework.components.drawing.Shape {
            return this._shape;
        }

        public set shape(value:entityframework.components.drawing.Shape) {
            if (this._shape != null) {
                this._shape.stopListening("shape", this);
            }

            this._shape = value;

            if (value != null) {
                value.listenForChanges("shape", this)
            }
        }
        //endregion
    }

}