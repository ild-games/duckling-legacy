
import SystemWindow from '../../util/SystemWindow';
import CommandQueue from '../command/CommandQueue';
import ConfigureRivets from '../dependencies/ConfigureRivets';
import {setupMouestrapBindings} from '../dependencies/Mousetrap';
import Views from '../view/Views';
import contextKeySymbol from './ContextKeySymbol';

/**
* The context holds objects shared between different parts of the application.
*/
export default class Context {
    private _views : Views;
    private _commandQueue : CommandQueue;
    private _window : Window;
    private _rivets;
    private _sharedObjects : {} = {};
    private _systemWindow : SystemWindow = new SystemWindow();

    /**
    * Construct a new context.
    * @param templateContainer The object containing all of the jade templates.
    * @param window The window object the context is bound to.
    */
    constructor(templateContainer, window: Window) {
        this._views = new Views(templateContainer);
        this._commandQueue = new CommandQueue();
        this._window = window;
        this._rivets = window["rivets"];

        ConfigureRivets(window, this._rivets, this._commandQueue);
        this.onEnterContext();
    }

    /**
    * Called when a user switches to the context. EX: They have two windows open
    * and they move from one window to the other.  Each window could have its own
    * context.
    */
    onEnterContext() {
        setupMouestrapBindings(this.window, this);
    }

    /**
    * Retrieve a shared object from the context.
    * @param key Key describing a shared object.
    * @returns The shared object if it exists or null.
    */
    getSharedObjectByKey(key : string) {
        return this._sharedObjects[key] || null;
    }

    /**
    * Get the shared object that provides an instance of the given class.
    * @param sharedClass The class of the object that is being retrieved.
    * @returns An instance of the shared class if it exists.  Null if it doesn't.
    */
    getSharedObject(sharedClass : Function) {
        return this.getSharedObjectByKey(sharedClass[contextKeySymbol]);
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

    /**
    * Store a shared object on the context. Any ViewModel that shares that context
    * will have access to the object. It will be stored with the context key symbol
    * which is set via decorator on the class.
    * @param sharedObj Object that is being stored on the context.
    */
    setSharedObject(sharedObject : {}) {
        this.setSharedObjectByKey(sharedObject.constructor[contextKeySymbol], sharedObject);
    }

    //region Getters and Setters
    get views() : Views {
        return this._views;
    }

    get commandQueue() : CommandQueue {
        return this._commandQueue;
    }

    get window() : Window {
        return this._window;
    }

    get systemWindow() : SystemWindow {
        return this._systemWindow;
    }

    get rivets() {
        return this._rivets;
    }
    //endregion
}
