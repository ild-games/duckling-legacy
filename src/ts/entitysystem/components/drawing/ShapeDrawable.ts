///<reference path="../../../util/JsonLoader.ts"/>
module entityframework.components.drawing {

    import serialize = util.serialize;

    /**
     * Represents a shape that can be drawn in the game.
     */
    @serialize.ProvideClass(Drawable, "ild::ShapeDrawable")
    export class ShapeDrawable extends Drawable {
        @serialize.Key("shape")
        private _shape : Shape;

        constructor(shape : entityframework.components.drawing.Shape, key : string) {
            super(key);
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