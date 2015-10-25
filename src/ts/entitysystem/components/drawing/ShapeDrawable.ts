///<reference path="../../../util/JsonLoader.ts"/>
///<reference path="./RectangleShape.ts"/>
///<reference path="./CircleShape.ts"/>
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

    export enum ShapeType {
        Rectangle,
        Circle
    }

    var ShapeTypeToFactory = {
        Rectangle: new RectangleShapeFactory(),
        Circle: new CircleShapeFactory()
    }

    export class ShapeDrawableViewModel extends framework.ViewModel<ShapeDrawable> implements framework.observe.Observer {
        private shapeTypePicker : controls.SelectControl<ShapeType>;

        get viewFile() : string {
            return 'drawables/shape_drawable';
        }

        constructor() {
            super();
            this.registerCallback("add-shape", this.addShape);
        }

        onDataReady() {
            super.onDataReady();
            this.data.listenForChanges("data", this);
        }

        onViewReady() {
            super.onViewReady();
            this.shapeTypePicker = new controls.SelectControl<ShapeType>(
                this,
                "selShapeType",
                util.formatters.valuesFromEnum(ShapeType),
                ShapeType[ShapeType.Rectangle]);

            if (!this.data.shape) {
                $(this.findById("divShapeType")).removeClass("gone");
            }
        }

        onDataChanged(key : string, event : framework.observe.DataChangeEvent) {
        }

        private addShape() {
            $(this.findById("divShapeType")).addClass("gone");
            var shapeFactory = ShapeTypeToFactory[this.shapeTypePicker.value];
            if (shapeFactory) {
                this.data.shape = shapeFactory.createShape();
                this.addShapeVM(shapeFactory);
            }
        }

        private addShapeVM(shapeFactory : framework.VMFactory) {
            if (this.data.shape) {
                this.addChildView(
                    "shapeVM",
                    shapeFactory.createFormVM(),
                    this.data.shape);
            }
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
