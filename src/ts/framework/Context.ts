module framework {

    /**
     * The context holds objects shared between different parts of the application.
     */
    export class Context {
        private _views : framework.Views;
        private _commandQueue : framework.command.CommandQueue;
        private _window : Window;
        private _rivets;
        private _sharedObjects : {} = {};

        /**
         * Construct a new context.
         * @param templateContainer The object containing all of the jade templates.
         * @param window The window object the context is bound to.
         */
        constructor(templateContainer, window: Window) {
            this._views = new framework.Views(templateContainer);
            this._commandQueue = new framework.command.CommandQueue();
            this._window = window;
            this._rivets = window["rivets"];

            framework.dependencies.ConfigureRivets(window, this._rivets, this._commandQueue);
            this.onEnterContext();
        }

        /**
         * Called when a user switches to the context. EX: They have two windows open
         * and they move from one window to the other.  Each window could have its own
         * context.
         */
        onEnterContext() {
            dependencies.setupMouestrapBindings(this.window, this);
        }

        /**
         * Retrieve a shared object from the context.
         * @param key Key describing a shared object.
         * @returns {any}
         */
        getSharedObjectByKey(key : string) {
            return this._sharedObjects[key];
        }

        /**
         * Store a shared object on the context.  Any ViewModel that shares the context
         * will have access to the object.
         * @param key Key describing the shared object.
         * @param obj Object that is being stored on the context.
         */
        setSharedObjectByKey(key : string, obj : {}) {
            this._sharedObjects[key] = obj;
        }

        //region Getters and Setters
        get views() : framework.Views {
            return this._views;
        }

        get commandQueue() : framework.command.CommandQueue {
            return this._commandQueue;
        }

        get window() : Window {
            return this._window;
        }

        get rivets() {
            return this._rivets;
        }
        //endregion
    }
}