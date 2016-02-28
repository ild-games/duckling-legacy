import {RectangleShape} from '../../entitysystem/components/drawing/RectangleShape';
import SimpleObservable from '../../framework/observe/SimpleObservable';
import Vector from '../../math/Vector';
import CanvasDrawnElement from './CanvasDrawnElement';

/**
 * A collision bounding box that can be drawn on the canvas.
 */
export default class BoundingBox extends SimpleObservable implements CanvasDrawnElement {
    private _rectangle : RectangleShape;
    private _color : string;

    constructor(dimensions : Vector, color : string) {
        super();
        this._rectangle = new RectangleShape(dimensions);
        this._color = color;
    }

    getDrawable() : createjs.DisplayObject {
        var box = new createjs.Shape();
        var topLeft = new Vector(
            -(this._rectangle.dimension.x / 2),
            -(this._rectangle.dimension.y / 2));
        var topRight = new Vector(topLeft.x + this._rectangle.dimension.x, topLeft.y);
        var bottomLeft = new Vector(topLeft.x, topLeft.y + this._rectangle.dimension.y);
        var bottomRight = new Vector(topLeft.x + this._rectangle.dimension.x, topLeft.y + this._rectangle.dimension.y);

        box.graphics
            .beginStroke(this._color)
            .drawRect(
                -(this._rectangle.dimension.x / 2),
                -(this._rectangle.dimension.y / 2),
                this._rectangle.dimension.x,
                this._rectangle.dimension.y)
            .moveTo(topLeft.x, topLeft.y)
            .lineTo(bottomRight.x, bottomRight.y)
            .moveTo(topRight.x, topRight.y)
            .lineTo(bottomLeft.x, bottomLeft.y);
        return box;
    }
}
