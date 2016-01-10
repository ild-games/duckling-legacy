
module editorcanvas.tools {

    /**
     * A Tool provides functionality to interact with the canvas and entities on the
     * canvas.
     */
    export interface Tool {
        /**
         * Hook to bind the context this tool is used with.
         */
        onBind(context : framework.Context);

        /**
         * Hook to dispatch the events a tool cares about.
         */
        onEvent(event, canvas : editorcanvas.CanvasVM);

        /**
         * Returns the EaselJS DisplayObject that represents this tool for the canvas.
         */
        getDisplayObject() : createjs.DisplayObject;
    }
}
