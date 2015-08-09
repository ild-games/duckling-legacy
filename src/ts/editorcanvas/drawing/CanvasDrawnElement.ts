module editorcanvas.drawing {
    /**
     * Defines what all elements that can be drawn to the canvas must do.
     */
    export interface CanvasDrawnElement {
        /**
         * Draws the element to the canvas context
         *
         * @param context Drawing context.
         */
        draw(context: CanvasRenderingContext2D);
    }
}

