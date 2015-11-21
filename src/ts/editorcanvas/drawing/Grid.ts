module editorcanvas.drawing {
    export class Grid implements CanvasDrawnElement {
        private _cellDimensions : math.Vector;
        private _canvasDimensions : math.Vector;
        private _drawable : createjs.Shape;

        constructor(cellDimensions : math.Vector, canvasDimensions : math.Vector) {
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

        private constructGrid() {
            if (this.cellDimensions && this.canvasDimensions) {
                this._drawable = new createjs.Shape();
                this._drawable.graphics.setStrokeDash([2, 2]);
                this._drawable.graphics
                    .setStrokeStyle(1, 0, 0, 10, true)
                    .beginStroke("#000");
                for (var x = -(this.canvasDimensions.x / 2); x < this.canvasDimensions.x / 2; x += this.cellDimensions.x) {
                    this._drawable.graphics
                        .moveTo(x, -(this.canvasDimensions.y / 2))
                        .lineTo(x, this.canvasDimensions.y / 2);
                }
                for (var y = -(this.canvasDimensions.y / 2); y < this.canvasDimensions.y / 2; y += this.cellDimensions.y) {
                    this._drawable.graphics
                        .moveTo(-(this.canvasDimensions.x / 2), y)
                        .lineTo(this.canvasDimensions.x / 2, y);

                }
            }
        }

        get cellDimensions() : math.Vector {
            return this._cellDimensions;
        }

        get canvasDimensions() : math.Vector {
            return this._canvasDimensions;
        }

        set cellDimensions(cellDimensions : math.Vector) {
            this._cellDimensions = cellDimensions;
            this.constructGrid();
        }

        set canvasDimensions(canvasDimensions : math.Vector) {
            this._canvasDimensions = canvasDimensions;
            this.constructGrid();
        }
    }
}
