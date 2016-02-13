module editorcanvas.drawing {
    import observe = framework.observe;

    export class Grid extends observe.SimpleObservable implements CanvasDrawnElement {
        @ObservePrimitive(Number)
        cellDimensions : number = 0;

        @ObserveObject()
        canvasDimensions : math.Vector;

        private _drawable : createjs.Shape;

        constructor(cellDimensions : number, canvasDimensions : math.Vector) {
            super();
            this.cellDimensions = cellDimensions;
            this.canvasDimensions = canvasDimensions;
        }

        getDrawable(position : math.Vector) : createjs.DisplayObject {
            if (this._drawable) {
                this._drawable.x = position.x + 0.5;
                this._drawable.y = position.y + 0.5;
            }
            return this._drawable;
        }

        public constructGrid(color : string) {
            if (this.cellDimensions && this.canvasDimensions) {
                this._drawable = new createjs.Shape();
                this._drawable.graphics
                    .setStrokeStyle(1, 0, 0, 10, true)
                    .beginStroke(color);
                var xBound = this.cellDimensions * Math.floor((this.canvasDimensions.x / 2) / this.cellDimensions);
                var yBound = this.cellDimensions * Math.floor((this.canvasDimensions.y / 2) / this.cellDimensions);
                for (var x = -xBound; x <= xBound; x += this.cellDimensions) {
                    this._drawable.graphics
                        .moveTo(x, -(this.canvasDimensions.y / 2))
                        .lineTo(x, this.canvasDimensions.y / 2);
                }
                for (var y = -yBound; y <= yBound; y += this.cellDimensions) {
                    this._drawable.graphics
                        .moveTo(-(this.canvasDimensions.x / 2), y)
                        .lineTo(this.canvasDimensions.x / 2, y);
                }
            }
        }
    }
}
