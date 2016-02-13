import CommandQueue from '../command/CommandQueue';
import DataChangeCallback from '../observe/DataChangeCallback';
import Observable from '../observe/Observable';
import {CreateFormatters} from './RivetsFormatters';
import RivetInputCommand from './RivetInputCommand';

declare var Symbol : any;

var callbackSymbol = Symbol("CallbackObserver");
class CallbackObserver {
    private callback : Function;
    private observerCallback : DataChangeCallback<any>;
    private toObserve : Observable<any>;

    constructor(callback : Function, toObserve : Observable<any>) {
        if (callback[callbackSymbol]) {
            throw "Unable to attach two CallbackObservers to the same object";
        }
        callback[callbackSymbol] = this;

        this.callback = callback;
        this.toObserve = toObserve;
        this.observerCallback = () => {
            this.callback();
        }

        toObserve.addChangeListener(this.observerCallback);
    }

    unbind() {
        this.toObserve.removeChangeListener(this.observerCallback);
    }

    static getObserver(callback : Function) {
        return callback[callbackSymbol];
    }
}

/**
 * Configures rivets for the duckling editor.
 *
 * Binder: "rv-command-*"
 * Example: <button "rv-command-foo"="data.thing">Click Me!</button>
 * Behavior: When the button is clicked the foo command callback will be fired on the view model.  The argument
 *           will be the data.thing object.  The binder can be used on any HTML element type.
 *
 * @param rivets The object containing the rivets library
 * @param commandQueue The command queue that two-way bindings use to undo changes.
 */
export default function ConfigureRivets(window, rivets, commandQueue : CommandQueue) {
    CreateFormatters(window, rivets);

    var symbolMap = {};

    function getSymbolForEvent(event : string) {
        if (!(event in symbolMap)) {
            symbolMap[event] = Symbol(event);
        }

        return symbolMap[event];
    }

    if ("command-*" in rivets.binders) {
        return;
    }

    function removeCommandCallback(el : HTMLElement, event : string) {
        var symbol = getSymbolForEvent(event);
        if (el[symbol]) {
            el.removeEventListener(event, el[symbol]);
            el[symbol] = null;
        }
    }

    function addCommandCallback(el : HTMLElement, callback, event: string) {
        var symbol = getSymbolForEvent(event);
        el.addEventListener(event, callback);
        el[symbol] = callback;
    }

    rivets.adapters["."] = {
        observe: function(obj,keypath,callback){
            window.Object.observe(obj,callback);
        },
        unobserve: function(obj,keypath,callback){
            window.Object.unobserve(obj,callback);
        },
        get: function(obj,keypath){
            return obj[keypath];
        },
        set: function(obj,keypath,value){
            var command = new RivetInputCommand(obj,keypath,value);
            var prevCommand = commandQueue.peekUndo();

            //Add the command to the queue if the queue is empty or it could not be
            // merged with the last command.
            if (!prevCommand || !command.tryMerge(prevCommand)) {
                commandQueue.pushCommand(command);
            }
        }
    };

    rivets.adapters["%"] = {
        observe : function(obj : Observable<any>, keypath, callback) {
            new CallbackObserver(callback, obj);
        },

        unobserve : function(obj : Observable<any>, keypath, callback) {
            var observer = CallbackObserver.getObserver(callback);
            observer.unbind();
        },

        get : function(obj, keypath) {
            return obj[keypath];
        },

        set : function(obj, keypath, value) {
            throw "Set should not be called on the Observer adapter.";
        }
    };

    rivets.adapters["@"] = {
        observe : function() {

        },
        unobserve : function() {

        },
        get : function(obj, keypath) {
            return window[keypath];
        },
        set : function(obj, keypath, value) {
            throw "Set should never be called on this adapter";
        }
    };

    function getEventAndCommand(binding) {
        var command = binding.type.slice("command-".length);
        var event : string = "click";
        var hasEvent = command.search("-ev-") != -1;
        if (hasEvent) {
            var evIdx = command.indexOf("-ev-");
            event = command.slice(evIdx + "-ev-".length);
            command = command.slice(0, evIdx);
        }
        return {event : event, command : command};
    };

    rivets.binders["command-*"] = {
        bind : function(el : HTMLElement) {

            var type = getEventAndCommand(this);
            var callback = (event) => {
                var value = null;
                if (this.keypath) {
                    var adapter = this.view.adapters[this.view.rootInterface];
                    value = adapter.get(this.model, this.keypath);
                }
                this.view.models.handleCommand(type.command, event, value);
            };
            removeCommandCallback(el, type.event);
            addCommandCallback(el, callback, type.event);
        },

        routine : function(el : HTMLElement, value) {

        },

        unbind : function(el : HTMLElement) {
            var type = getEventAndCommand(this);
            removeCommandCallback(el, type.event);
        }
    };
}
