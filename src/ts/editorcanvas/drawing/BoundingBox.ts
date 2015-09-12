///<reference path="../../framework/observe/Observable.ts"/>

module editorcanvas.drawing {
    /**
     * A collision bounding box that can be drawn on the canvas.
     */
    export class BoundingBox extends framework.observe.Observable implements CanvasDrawnElement {
        private _rectangle : Rectangle;
        private _color: string;

        constructor(topLeft : CanvasPoint, bottomRight : CanvasPoint, color : string) {
            super();
            this._rectangle = new Rectangle(topLeft, bottomRight);
            this._color = color;
        }

        getDrawable() {
            var box = new createjs.Shape();
            var rec = this._rectangle;
            box.graphics
                .beginStroke(this._color)
                .drawRect(rec.topLeft.x,rec.topRight.y,rec.width,rec.height)
                .moveTo(rec.topLeft.x, rec.topLeft.y)
                .lineTo(rec.bottomRight.x, rec.bottomRight.y)
                .moveTo(rec.topRight.x, rec.topRight.y)
                .lineTo(rec.bottomLeft.x, rec.bottomLeft.y);
            return box;
        }
    }
}
