module framework {
    var nextId : number = 0;

    /**
     * A ViewModel is responsible for responding to user actions and population the view
     * with information from the model.
     */
    export class ViewModel<T> {
        protected _children : ViewModel<any>[];
        protected _context : framework.Context;
        protected _htmlRoot : HTMLElement;
        protected _rivetsBinding;
        protected _commandCallbacks = {};
        protected _id = nextId++;
        private _data : T;

        /**
         * Initialize the ViewModel. Using init instead of the constructor means that
         * ViewModel subclasses don't need to implement a constructor and forward the
         * arguments to the superclass.
         * @param context Context the ViewModel is hosted in.
         * @param htmlRoot The HTML element the ViewModel is attached to.
         * @param data The root of the ViewModel's data.
         * @returns A reference to the ViewModel instance.
         */
        init(context: framework.Context, htmlRoot : HTMLElement, data : T) : ViewModel<T> {
            this._context = context;
            this._htmlRoot = htmlRoot;
            this._data = data;
            this.render();
            return this;
        }

        /**
         * Create an Id unique to the view. Calling id("string") will always produced the same result
         * for a specific view model, but it will produce different results for different view models.
         * Elements can be retrieved using the findById method.
         * @param base Base of the Id
         * @returns An Id unique to the ViewModel.
         */
        id(base : string) {
            return this._id + base;
        }

        findById(id : string) {
            return document.getElementById(this.id(id));
        }

        /**
         * Renders the ViewModel's template and binds the model to the view.
         */
        render() {
            this._htmlRoot.innerHTML = this._context.Views.getTemplate(this.viewFile)(this);
            this._rivetsBinding = this._context.Rivets.bind(this._htmlRoot, this);
            this.onReady();
        }

        /**
         * Detach the ViewModel and then render it again.
         */
        reset() {
            this.detach();
            this.render();
        }

        /**
         * Remove the ViewModel from the page.
         */
        detach() {
            this._rivetsBinding.unbind();
            this._htmlRoot.innerHTML = "";
        }

        /**
         * Called when the HTML for the view model is rendered and ready for dom manipulation.
         */
        onReady() {

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

        /**
         * Add a child viewmodel to the viewmodel. The child will be initialized and attached to the html hierarchy.
         * @param child ViewModel that is bound to a sub element of this ViewModel's html hierarchy.
         * @param element Element the view will be bound to.
         * @param data Model object the ViewModel is rendering.
         */
        addChild<T>(child : ViewModel<T>, element : HTMLElement, data : T) {
            this._children.push(child);
            child.init(this._context, element, data);
        }

        //region Getters and Setters
        get data() {
            return this._data;
        }
        //endregion
    }
}
