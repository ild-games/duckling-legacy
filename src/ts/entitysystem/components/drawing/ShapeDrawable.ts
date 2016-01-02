///<reference path="../../../util/JsonLoader.ts"/>
///<reference path="./RectangleShape.ts"/>
///<reference path="./CircleShape.ts"/>
module entityframework.components.drawing {

    import observe = framework.observe;
    import serialize = util.serialize;

    /**
     * Represents a shape that can be drawn in the game.
     */
    @serialize.ProvideClass(ShapeDrawable, "ild::ShapeDrawable")
    export class ShapeDrawable extends Drawable {
        @observe.Object()
        shape : Shape;

        constructor(key : string, shape? : entityframework.components.drawing.Shape) {
            super(key);
            this.shape = shape || null;
        }

        protected generateCanvasDisplayObject() : createjs.DisplayObject {
            var displayShape = null;
            if (this.shape) {
                displayShape = this.shape.getDrawable();
            }
            return displayShape;
        }

        get type() : DrawableType {
            return DrawableType.Shape;
        }
    }

    export enum ShapeType {
        Rectangle,
        Circle
    }

    export var ShapeTypeToFactory = {
        Rectangle: new RectangleShapeFactory(),
        Circle: new CircleShapeFactory()
    }

    export class ShapeDrawableViewModel extends framework.ViewModel<ShapeDrawable> {
        private shapeTypePicker : controls.SelectControl<ShapeType>;

        get viewFile() : string {
            return 'drawables/shape_drawable';
        }

        constructor() {
            super();
            this.registerCallback("add-shape", this.addShape);
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
            } else {
                this.addShapeVM(this.data.shape.factory);
            }
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
