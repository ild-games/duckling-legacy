module editorcanvas.drawing {
    /**
     * An object that represents a point on the canvas.
     */
    export class CanvasPoint {
        x : number;
        y : number;

        /**
         * Create a point.
         * @param x The x position of the point.
         * @param y The y position of the point.
         */
        constructor(x : number, y : number) {
            this.x = x;
            this.y = y;
        }
    }
}