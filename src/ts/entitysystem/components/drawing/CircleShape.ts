import ViewModel from '../../../framework/ViewModel';
import {ObserveObject, ObservePrimitive} from '../../framework/observe/ObserveDecorators';
import Vector from '../../../math/Vector';
import CanvasDrawnElement from '../../../editorcanvas/drawing/CanvasDrawnElement';
import * as serialize from '../../../util/serialize/Decorators';
import ShapeFactory from './ShapeFactory';
import ShapeType from './ShapeType';
import Shape from './Shape';

/**
 * A shape that represents a circle.
 */
@serialize.ProvideClass(CircleShape, "sf::CircleShape")
export class CircleShape extends Shape implements CanvasDrawnElement {
    @ObservePrimitive(Number)
    radius : number;

    constructor(radius? : number) {
        super();
        this.radius = radius || 0;
    }

    getDrawable() {
        var easelCircle = new createjs.Shape();
        easelCircle.graphics.beginFill(this.fillColor.rgbaStringFormat()).
            drawCircle(0, 0, this.radius);
        return easelCircle;
    }

    get type() : ShapeType {
        return ShapeType.Circle;
    }
}

export class CircleShapeViewModel extends ViewModel<CircleShape> {
    get viewFile() : string {
        return "drawables/circle_shape";
    }
}

export class CircleShapeFactory implements ShapeFactory {
    createFormVM() : ViewModel<any> {
        return new CircleShapeViewModel();
    }

    createShape() : Shape {
        return new CircleShape();
    }
}
