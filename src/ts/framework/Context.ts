module framework {
    /**
     * The context holds objects shared between different parts of the application.
     */
    export class Context {
        private _views : framework.Views;
        private _commandQueue : framework.CommandQueue;
        private _window : Window;
        private _rivets;

        /**
         * Construct a new context.
         * @param templateContainer The object containing all of the jade templates.
         * @param window The window object the context is bound to.
         */
        constructor(templateContainer, window: Window) {
            this._views = new framework.Views(templateContainer);
            this._commandQueue = new framework.CommandQueue();
            this._window = window;
            this._rivets = window["rivets"];
        }

        //region Getters and Setters
        get Views() : framework.Views {
            return this._views;
        }

        get CommandQueue() : framework.CommandQueue {
            return this._commandQueue;
        }

        get Window() : Window {
            return this._window;
        }

        get Rivets() {
            return this._rivets;
        }
        //endregion
    }
}