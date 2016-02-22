var gui = _require("nw.gui");

/**
* Provides a wrapper for the node webkit window.
*/
export default class SystemWindow {
    private window;

    constructor(window?) {
        this.window = window || gui.Window.get();
    }

    /**
    * Make the window full screen.
    */
    makeFullscreen() {
        this.clearFixedSize();
        this.window.maximize();
    }

    /**
    * Move the window to the center of the screen. Only works if the window is not fullscreen.
    */
    center() {
        this.window.setPosition("center");
        //Hack to fix a bug caused by centering the window. If you go from fullscreen -> center then you can't
        //resize the window programmatically until the user resizes it or moves it.  Turns out it is also ok if
        //we try to move it zero spaces.
        this.window.moveBy(0,0);
    }

    /**
    * Clear the fixed size so that the user can resize the window at will.  Does not change the size of the
    * window.
    */
    clearFixedSize() {
        this.window.setResizable(true);
    }

    /**
    * Set the window to be a fixed size.
    * @param width Width in pixels for the window.
    * @param height Height in pixels for the window.
    */
    setFixedSize(width : Number, height : Number) {
        this.window.unmaximize();
        this.window.resizeTo(width, height);
        this.window.setResizable(false);
    }
}
