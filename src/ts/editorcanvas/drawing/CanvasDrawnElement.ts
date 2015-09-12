module editorcanvas.drawing {
    /**
     * Defines what all elements that can be drawn to the canvas must do.
     */
    export interface CanvasDrawnElement {
        /**
         * Return an element that can be rendered on a stage.
         */
        getDrawable() : createjs.DisplayObject;
    }
}

