///<reference path="../../util/JsonLoader.ts"/>
module framework.observe {

    import serialize = util.serialize;

    /**
     * Base class for Observable objects.  Objects implementing the Observer interface can
     * listen to changes in the observable object.  Observable objects are themselves observers.
     * This allows data changed events to populate up a chain of observers.
     */
    export class Observable implements Observer {
        @serialize.Ignore
        private _listener : { [key:string]:Observer[] } = {};

        /**
         * Registers the observer with the object.  Whenever the data changes onDataChanged will
         * be called on the observer.
         * @param key Key describing the object from the observers perspective.
         * @param observer Object that is listening for changes.
         */
        listenForChanges(key: string, observer: Observer) {
            if (this._listener[key]) {
                this._listener[key].push(observer);
            } else {
                this._listener[key] = [observer];
            }
        }

        /**
         * Called when the observer stops wanting updates from the Observable object.
         * @param key Key that the observer registered itself with.
         * @param observer Object that was listening for changes.
         */
        stopListening(key : string, observer: Observer) {
            if (this._listener[key]) {
                this._listener[key].filter(function (obs) {
                   return  obs == observer;
                });
                if (this._listener[key].length) {
                    delete this._listener[key];
                }
            }
        }

        /**
         * Called when a child of the observable object changes.  Reminder: The observable
         * object needs to call listenForChanges on the child objects it wants to listen to.
         * @param key String key that was used to listen to the object.  Should normally be a key
         * that can be used to retrieve the child from the parent.  EX: If the parent is an array
         * then the key should be the child's index in the array.
         * @param event Event describing how the data was changed.
         */
        onDataChanged(key: string, event : DataChangeEvent) {
            this.notifyChanges("ChildModified", {key : key}, event);
        }

        /**
         * Objects implementing Observable should call dataChanged when they want to notify change
         * listeners.
         * @param name Name describing the event.  Example: "Resized"
         * @param data Data that can be used to simplify the change processing.  Ex: {oldsize:#, newsize:#}
         */
        protected dataChanged (name: string, data) {
            this.notifyChanges(name, data, null);
        }

        private notifyChanges (name: string, data, trigger : DataChangeEvent) {
            var event = new DataChangeEvent(data, name, trigger, this);
            for (var key in this._listener) {
                this._listener[key].forEach(function(obs) { obs.onDataChanged(key, event) });
            }
        }
    }
}