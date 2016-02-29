import RivetsViewModel from '../../../framework/RivetsViewModel';
import {ObserveObject} from '../../../framework/observe/ObserveDecorators';
import Vector from '../../../math/Vector';
import CanvasDrawnElement from '../../../editorcanvas/drawing/CanvasDrawnElement';
import * as serialize from '../../../util/serialize/Decorators';
import ShapeFactory from './ShapeFactory';
import ShapeType from './ShapeType';
import Shape from './Shape';

/**
 * A shape that represents a rectangle.
 */
@serialize.ProvideClass(RectangleShape, "sf::RectangleShape")
export class RectangleShape extends Shape implements CanvasDrawnElement {
    @ObserveObject()
    dimension : Vector;

    constructor(dimension? : Vector) {
        super();
        this.dimension = dimension || new Vector();
    }

    getDrawable() {
        var rec = new createjs.Shape();
        rec.graphics.beginFill(this.fillColor.rgbaStringFormat()).drawRect(
            -(this.dimension.x / 2),
            -(this.dimension.y / 2),
            this.dimension.x,
            this.dimension.y);
        return rec;
    }


    get type() : ShapeType {
        return ShapeType.Rectangle;
    }

    get factory() : ShapeFactory {
        return new RectangleShapeFactory();
    }
}

export class RectangleShapeViewModel extends RivetsViewModel<RectangleShape> {
    get viewFile() : string {
        return "drawables/rectangle_shape";
    }
}

export class RectangleShapeFactory implements ShapeFactory {
    createFormVM() {
        return new RectangleShapeViewModel();
    }

    createShape() {
        return new RectangleShape();
    }
}
