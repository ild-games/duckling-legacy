///<reference path="../../framework/observe/Observable.ts"/>

module editorcanvas.drawing {
    /**
     * A collision bounding box that can be drawn on the canvas.
     */
    export class BoundingBox extends framework.observe.Observable implements CanvasDrawnElement {
        _rectangle : Rectangle;
        _color: string;

        constructor(topLeft : CanvasPoint, bottomRight : CanvasPoint, color : string) {
            super();
            this._rectangle = new Rectangle(topLeft, bottomRight);
            this._color = color;
        }

        draw(context: CanvasRenderingContext2D) {
            var oldStrokeCol = context.strokeStyle;
            var oldLineWidth = context.lineWidth;
            context.closePath();
            context.stroke();

            context.strokeStyle = this._color;
            context.lineWidth = 1;
            context.beginPath();
            this._rectangle.draw(context);
            context.moveTo(this._rectangle.topLeft.x, this._rectangle.topLeft.y);
            context.lineTo(this._rectangle.bottomRight.x, this._rectangle.bottomRight.y);
            context.moveTo(this._rectangle.topRight.x, this._rectangle.topRight.y);
            context.lineTo(this._rectangle.bottomLeft.x, this._rectangle.bottomLeft.y);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.strokeStyle = oldStrokeCol;
            context.lineWidth = oldLineWidth;
        }
    }
}
