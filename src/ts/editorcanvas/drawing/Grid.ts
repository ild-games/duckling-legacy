module editorcanvas.drawing {
    import observe = framework.observe;

    export class Grid extends observe.Observable implements CanvasDrawnElement {
        @observe.Primitive(Number)
        cellDimensions : number = 0;

        @observe.Object()
        canvasDimensions : math.Vector;

        private _drawable : createjs.Shape;

        constructor(cellDimensions : number, canvasDimensions : math.Vector) {
            super();
            this.cellDimensions = cellDimensions;
            this.canvasDimensions = canvasDimensions;
        }

        getDrawable(position : math.Vector) : createjs.DisplayObject {
            if (this._drawable) {
                this._drawable.x = position.x;
                this._drawable.y = position.y;
            }
            return this._drawable;
        }

        public constructGrid() {
            if (this.cellDimensions && this.canvasDimensions) {
                this._drawable = new createjs.Shape();
                this._drawable.graphics
                    .setStrokeStyle(1, 0, 0, 10, true)
                    .beginStroke("#000000");
                var xBound = this.cellDimensions * Math.ceil(this.canvasDimensions.x / this.cellDimensions);
                var yBound = this.cellDimensions * Math.ceil(this.canvasDimensions.y / this.cellDimensions);
                for (var x = -xBound; x <= xBound; x += this.cellDimensions) {
                    this._drawable.graphics
                        .moveTo(x, -yBound)
                        .lineTo(x, yBound);
                }
                for (var y = -yBound; y <= yBound; y += this.cellDimensions) {
                    this._drawable.graphics
                        .moveTo(-xBound, y)
                        .lineTo(xBound, y);

                }
            }
        }
    }
}
