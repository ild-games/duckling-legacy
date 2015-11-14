///<reference path="../../framework/observe/Observable.ts"/>

module editorcanvas.drawing {

    import es_drawing = entityframework.components.drawing;

    /**
     * A collision bounding box that can be drawn on the canvas.
     */
    export class BoundingBox extends framework.observe.Observable implements CanvasDrawnElement {
        private _rectangle : es_drawing.RectangleShape;
        private _color: string;

        constructor(dimensions : math.Vector, color : string) {
            super();
            this._rectangle = new es_drawing.RectangleShape(dimensions);
            this._color = color;
        }

        getDrawable(position : math.Vector) : createjs.DisplayObject {
            var box = new createjs.Shape();
            var topLeft = new math.Vector(
                position.x - (this._rectangle.dimension.x / 2),
                position.y - (this._rectangle.dimension.y / 2));
            var topRight = new math.Vector(topLeft.x + this._rectangle.dimension.x, topLeft.y);
            var bottomLeft = new math.Vector(topLeft.x, topLeft.y + this._rectangle.dimension.y);
            var bottomRight = new math.Vector(topLeft.x + this._rectangle.dimension.x, topLeft.y + this._rectangle.dimension.y);

            box.graphics
                .beginStroke(this._color)
                .drawRect(
                    position.x - (this._rectangle.dimension.x / 2),
                    position.y - (this._rectangle.dimension.y / 2),
                    this._rectangle.dimension.x,
                    this._rectangle.dimension.y)
                .moveTo(topLeft.x, topLeft.y)
                .lineTo(bottomRight.x, bottomRight.y)
                .moveTo(topRight.x, topRight.y)
                .lineTo(bottomLeft.x, bottomLeft.y);
            return box;
        }
    }
}
