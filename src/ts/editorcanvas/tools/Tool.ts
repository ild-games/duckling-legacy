module editorcanvas.tools {

    /**
     *
     */
    export interface Tool {
        /**
         *
         */
        onBind(context : framework.Context, canvas : editorcanvas.CanvasVM);

        /**
         *
         */
        onEvent(event);
    }
}
