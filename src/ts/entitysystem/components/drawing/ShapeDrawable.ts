import SelectControl from '../../../controls/SelectControl';
import {ObserveObject} from '../../../framework/observe/ObserveDecorators';
import SimpleObservable from '../../../framework/observe/SimpleObservable';
import RivetsViewModel from '../../../framework/RivetsViewModel';
import VMFactory from '../../../framework/VMFactory';
import {formatToTitleCase, valuesFromEnum} from '../../../util/Formatters';
import * as serialize from '../../../util/serialize/Decorators';
import ResourceManager from '../../ResourceManager';

import Drawable from './Drawable';
import DrawableFactory from './DrawableFactory';
import DrawableType from './DrawableType';
import Shape from './Shape';
import ShapeFactory from './ShapeFactory';
import ShapeType from './ShapeType';
import ShapeTypeToFactory from './ShapeTypeToFactory';

/**
* Represents a shape that can be drawn in the game.
*/
@serialize.ProvideClass(ShapeDrawable, "ild::ShapeDrawable")
export class ShapeDrawable extends Drawable {
    @ObserveObject()
    shape : Shape;

    constructor(key : string, shape? : Shape) {
        super(key);
        this.shape = shape || null;
    }

    protected generateCanvasDisplayObject(resourceManager : ResourceManager) : createjs.DisplayObject {
        var displayShape = null;
        if (this.shape) {
            displayShape = this.shape.getDrawable();
        }
        return displayShape;
    }

    get type() : DrawableType {
        return DrawableType.Shape;
    }

    @serialize.Ignore
    get factory() : DrawableFactory {
        return new ShapeDrawableFactory();
    }
}

export class ShapeDrawableViewModel extends RivetsViewModel<ShapeDrawable> {
    private shapeTypePicker : SelectControl<ShapeType>;

    get viewFile() : string {
        return 'drawables/shape_drawable';
    }

    constructor() {
        super();
        this.registerCallback("add-shape", this.addShape);
    }

    onViewReady() {
        super.onViewReady();
        this.shapeTypePicker = new SelectControl<ShapeType>(
            this,
            "selShapeType",
            valuesFromEnum(ShapeType),
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

        private addShapeVM(shapeFactory : VMFactory) {
            if (this.data.shape) {
                this.addChildView(
                    "shapeVM",
                    shapeFactory.createFormVM(),
                    this.data.shape);
            }
        }
    }

    export class ShapeDrawableFactory implements DrawableFactory {
        createFormVM() {
            return new ShapeDrawableViewModel();
        }

        createDrawable(key : string) {
            return new ShapeDrawable(key);
        }
    }
