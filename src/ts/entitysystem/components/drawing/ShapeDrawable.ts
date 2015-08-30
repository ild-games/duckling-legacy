///<reference path="../../../util/JsonLoader.ts"/>
module entityframework.components.drawing {

    import observe = framework.observe;
    import serialize = util.serialize;

    /**
     * Represents a shape that can be drawn in the game.
     */
    @serialize.ProvideClass(Drawable, "ild::ShapeDrawable")
    export class ShapeDrawable extends Drawable {
        @observe.Object()
        shape : Shape;

        constructor(shape : entityframework.components.drawing.Shape, key : string) {
            super(key);
            this.shape = shape;
        }
    }
}