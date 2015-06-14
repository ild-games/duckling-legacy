///<reference path="../../framework/observe/Observable.ts"/>

module editorcanvas.drawing {
    /**
     * A rectangle that can be drawn on the canvas.
     */
    export class Rectangle extends framework.observe.Observable {
        private _topLeft : CanvasPoint;
        private _bottomRight : CanvasPoint;

        /**
         * Create a rectangle that can be drawn on a canvas
         * @param topLeft The top left point of the rectangle.
         * @param bottomRight The bottom right point of the rectangle.
         */
        constructor(topLeft : CanvasPoint, bottomRight : CanvasPoint) {
            super();
            this._bottomRight = bottomRight;
            this._topLeft = topLeft;
        }

        draw(context: CanvasRenderingContext2D) {
            context.rect(this.topLeft.x, this.topLeft.y, this.width, this.height);
        }

        //region Getters and Setters
        set topLeft(point : CanvasPoint) {
            this._topLeft = point;
            this.dataChanged("TopLeft", this.topLeft);
        }

        set topRight(point : CanvasPoint) {
            this._topLeft.y = point.y;
            this._bottomRight.x = point.x;
            this.dataChanged("TopRight", this.topRight);
        }

        set bottomLeft(point : CanvasPoint) {
            this._topLeft.x = point.x;
            this._bottomRight.y = point.y;
            this.dataChanged("BottomLeft", this.bottomLeft);
        }

        set bottomRight(point : CanvasPoint) {
            this._bottomRight = point;
            this.dataChanged("BottomRight", this.bottomRight);
        }

        get topLeft() : CanvasPoint {
            return this._topLeft;
        }

        get bottomRight() : CanvasPoint {
            return this._bottomRight;
        }

        get topRight() : CanvasPoint {
            return new CanvasPoint(this.bottomRight.x, this._topLeft.y);
        }

        get bottomLeft() : CanvasPoint {
            return new CanvasPoint(this._topLeft.x, this._bottomRight.y);
        }

        get width() : number {
            return this._bottomRight.x - this._topLeft.x;
        }

        get height() : number {
            return this._topLeft.y - this._bottomRight.y;
        }
        //endregion
    }
}