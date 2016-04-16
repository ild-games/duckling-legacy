import Command from './command/Command';
import Context from './context/Context';
import Observable from './observe/Observable';
import DataChangeEvent from './observe/DataChangeEvent';
import DataChangeCallback from './observe/DataChangeCallback';
import DataObservations from './observe/DataObservations';

var nextId : number = 0;

const DUCKLING_VM_KEY = "ducklingViewModel";

/**
 * A ViewModel is responsible for responding to user actions and population the view
 * with information from the model.
 */
export default class ViewModel<T> {
    private dataObservations : DataObservations = new DataObservations();
    private _data : T;

    protected _children : {[id : string]:ViewModel<any>} = {};
    protected _attached : boolean = false;
    protected _context : Context;
    protected _htmlRoot : HTMLElement;
    protected _rivetsBinding;
    protected _commandCallbacks = {};
    protected _id = nextId++;

    private logging : boolean = true;

    /**
     * Initialize the ViewModel. Using init instead of the constructor means that
     * ViewModel subclasses don't need to implement a constructor and forward the
     * arguments to the superclass.
     * @param context Context the ViewModel is hosted in.
     * @param htmlRoot The HTML element the ViewModel is attached to.
     * @param data The root of the ViewModel's data.
     * @returns A reference to the ViewModel instance.
     */
    init(context: Context, htmlRoot : HTMLElement, data : T) : ViewModel<T> {
        this.setData(context, data);
        this.attach(htmlRoot);
        return this;
    }

    /**
     * Set the data and context used by the view model.
     * @param context Context the view model belongs to.
     * @param data Model object the view is bound to.
     */
    setData(context : Context, data : T) {
        this._context = context;
        this._data = data;

        this.log("Data Ready");
        this.onDataReady();
    }

    /**
     * Attach the ViewModel to an element on the page.
     * @param htmlRoot HTML element that will act as a root for the view model.
     */
    attach(htmlRoot : HTMLElement) {
        this.log("Attached");

        this._htmlRoot = htmlRoot;
        this._htmlRoot[DUCKLING_VM_KEY] = this;

        this.render();

        this.forEachChild((child, childID) => {
            child.attach(this.findById(childID));
        });

        this._attached = true;

        this.log("View Ready");
        this.onViewReady();
    }

    /**
     * Push a command into the command queue.
     * @param command Command to execute in the command queue.
     */
    pushCommand(command : Command) {
        this._context.commandQueue.pushCommand(command);
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

    /**
     * Find the child element with the given id.  The id will be transformed using the ViewModel.id method.
     * @param id Id describing the element to be retrieved.
     * @returns Element with the given Id.
     */
    findById(id : string) {
        return document.getElementById(this.id(id));
    }

    /**
     * Renders the ViewModel's template and binds the model to the view.
     */
    protected render() {
        this.log("Rendered");

        if (this.rootCSSClass !== "") {
            this._htmlRoot.classList.add(this.rootCSSClass);
        }
        //Note: The child class will actually render the content
    }

    /**
     * Render the template described by the given name and return it. The viewmodel will be available as the template's
     * this variable.
     * @param id The ID of the element the template should be inserted into
     * @param templateName The name of the template to be rendered.
     * @param locals An object available to the template.
     * @returns Returns the formatted HTML string.
     */
    renderTemplate(templateName : string, locals) {
        return this._context.views.getTemplate(templateName).call(this, locals);
    }

    /**
     * Detach the ViewModel and then render it again.
     */
    reset() {
        if (this._attached) {
            this.detach();
            this.render();
        }
    }

    /**
     * Remove the ViewModel from the page.
     */
    detach() {
        //Note: The child class will override this method to detach the view
        if (this._attached) {
            this._attached = false;
            this.forEachChild((child) => child.detach());
            this._htmlRoot[DUCKLING_VM_KEY] = null;
            if (this.rootCSSClass) {
                this._htmlRoot.classList.remove(this.rootCSSClass);
            }

            this.log("Detach");
            this.onDetach();
        }
    }

    /**
     * Destroy the ViewModel.  After this is called the view should never be reused.
     */
     destroy() {
         this.removeChildViews();
         this.dataObservations.removeChangeListeners();
         this.log("Destroyed");
         this.onDestroy();
     }

    /**
     * Called when the HTML for the view model is rendered and ready for dom manipulation.
     */
    onViewReady() {

    }

    /**
     * Called when the view model's data object is ready to be accessed.
     */
    onDataReady() {

    }

    /**
     * Called when the view get's detached from the tree.
     */
     onDetach() {

     }

    /**
     * Called when the view is destroyed and should no longer access the model unless
     * onDataReady is called again.
     */
    onDestroy() {

    }

    /**
     * The name of a CSS class that should be added to the DOM node the view model is
     * attached to.
     * @return {string} CSS class that will be added to the view's root.
     */
    get rootCSSClass() : string {
        return "";
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
     * @see DataObservations::setChangeListener
     */
    setChangeListener<T extends DataChangeEvent>(object : Observable<T>, callback : DataChangeCallback<T>) {
        this.dataObservations.setChangeListener(object, callback);
    }

    /**
     * @see DataObservations::removeChangeListeners
     */
    removeChangeListeners() {
        this.dataObservations.removeChangeListeners();
    }

    /**
     * @see DataObservations::removeChangeListener
     */
    removeChangeListener(object) {
        this.dataObservations.removeChangeListener(object);
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
     * Add a child view to the view.
     * @param id Id of the element the child view is bound to.
     * @param vm ViewModel that will be bound to a sub element of this ViewModel's html hierarchy.iewmodel of the child view.
     * @param data Model object the ViewModel is rendering.
     */
    addChildView(id : string, vm: ViewModel<any>, data : any) {
        this._children[id] = vm;
        vm.setData(this._context, data);

        if (this._attached) {
            vm.attach(this.findById(id));
        }
    }

    /**
     * Return the child bound to the element with the given Id.
     * @param id Id of the element the child is bound to.
     */
    getChildView(id : string) {
        return this._children[id] || null;
    }

    /**
     * Call to remove all child views.
     */
    protected removeChildViews() {
        if (this._attached) {
            this.forEachChild((child) => child.detach());
        }
        this.forEachChild((child) => child.destroy());
        this._children = {};
    }

    /**
     * Iterate over the view's child views.
     * @param callback Function called on each child view.
     */
    forEachChild(callback : (child : ViewModel<any>, key? : string) => void) {
        for (var key in this._children) {
            callback(this._children[key], key);
        }
    }

    /**
     * Replace the current view with the view specified.
     * @param replacement View model that will replace the current view.
     * @param data Data the view model will be initialized with.
     */
    replaceWithView(replacement : ViewModel<any>, data) {
        this.detach();
        this.destroy();
        replacement.init(this._context, this._htmlRoot, data);
    }

    /**
     * Log a message for debugging purposes.
     * @param message Message to be logged.
     */
    log(message : string) {
        if (this.logging) {
            this._context.window.console.log("[VM " + this.viewModelName + " " + this._id + "] " + message);
        }
    }

    /**
     * Walk up the tree of elements until you find a node that is the root of a view model.
     * @param  {HTMLElement} htmlElement Element to start the search from.
     * @return {ViewModel<any>} The ViewModel that contains the element.
     */
    static findViewModel(htmlElement : HTMLElement) : ViewModel<any> {
        var currentElement = htmlElement;
        while (currentElement) {
            if (currentElement[DUCKLING_VM_KEY]) {
                return currentElement[DUCKLING_VM_KEY];
            }
            currentElement = currentElement.parentElement;
        }
        return null;
    }

    //region Getters and Setters
    get data() {
        return this._data;
    }
    //endregion
}
