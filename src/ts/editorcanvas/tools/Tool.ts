
module editorcanvas.tools {

    /**
     * A Tool provides functionality to interact with the canvas and entities on the
     * canvas.
     */
    export interface Tool {
        /**
         * Hook to bind the context and canvas VM this tool is used with.
         */
        onBind(context : framework.Context, canvas : editorcanvas.CanvasVM);

        /**
         * Hook to dispatch the events a tool cares about.
         */
        onEvent(event);

        /**
         * Returns the EaselJS DisplayObject that represents this tool for the canvas.
         */
        getDisplayObject() : createjs.DisplayObject;
    }
}
