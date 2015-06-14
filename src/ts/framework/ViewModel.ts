module framework {
    /**
     * A ViewModel is responsible for responding to user actions and population the view
     * with information from the model.
     */
    export class ViewModel {
        protected _context : framework.Context;
        protected _htmlRoot : HTMLElement;
        protected _rivetsBinding;
        protected _commandCallbacks = {};
        private _data;

        /**
         * Initialize the ViewModel. Using init instead of the constructor means that
         * ViewModel subclasses don't need to implement a constructor and forward the
         * arguments to the superclass.
         * @param context Context the ViewModel is hosted in.
         * @param htmlRoot The HTML element the ViewModel is attached to.
         * @param data The root of the ViewModel's data.
         * @returns A reference to the ViewModel instance.
         */
        init(context: framework.Context, htmlRoot : HTMLElement, data) : ViewModel {
            this._context = context;
            this._htmlRoot = htmlRoot;
            this._data = data;
            this.render();
            return this;
        }

        /**
         * Renders the ViewModel's template and binds the model to the view.
         */
        render() {
            this._htmlRoot.innerHTML = this._context.Views.getTemplate(this.viewFile)(this);
            this._rivetsBinding = this._context.Rivets.bind(this._htmlRoot, this);
        }

        /**
         * Child classes should implement this
         * @returns A string defining the view used by the ViewModel.
         */
        get viewFile() : string {
            return "no_view_defined";
        }

        /**
         * Get the class name of the ViewModel.
         * @returns The ViewModel's class name.
         */
        get viewModelName() : string {
            return this.constructor["name"];
        }

        /**
         * Registers a view command callback.
         * @param key Key that identifies the command callback.
         * @param callback Callback that will be fired.
         */
        registerCallback(key : string, callback) {
            this._commandCallbacks[key] = (event, arg) => callback.call(this, event, arg);
        }

        /**
         * Called by rivets when a view command is fired.
         * @param key Key that identifies the view command.
         * @param event The event that triggered the callback.  Usually an HTML event.
         * @param arg Argument describing the event.
         */
        handleCommand(key : string, event, arg) {
            if (key in this._commandCallbacks) {
                this._commandCallbacks[key].call(this, event, arg);
            } else {
                debugger;
            }
        }

        //region Getters and Setters
        get data() {
            return this._data;
        }
        //endregion
    }
}
