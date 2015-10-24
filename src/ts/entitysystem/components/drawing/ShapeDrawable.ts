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

        constructor(key : string, shape? : entityframework.components.drawing.Shape) {
            super(key);
            this.shape = shape || null;
        }

        getCanvasDisplayObject() : createjs.DisplayObject {
            return null;
        }
    }

    export class ShapeDrawableViewModel extends framework.ViewModel<ShapeDrawable> implements framework.observe.Observer {
        get viewFile() : string {
            return 'drawables/shape_drawable';
        }

        onDataReady() {
            super.onDataReady();
            this.data.listenForChanges("data", this);
        }

        onDataChanged(key : string, event : framework.observe.DataChangeEvent) {
        }
    }

    export class ShapeDrawableFactory implements DrawableFactory {
        createFormVM() : framework.ViewModel<any> {
            return new ShapeDrawableViewModel();
        }

        createDrawable(key : string) : Drawable {
            return new ShapeDrawable(key);
        }
    }
}
