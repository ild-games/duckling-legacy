import {Ignore} from '../../util/serialize/Decorators';
import DataChangeCallback from './DataChangeCallback';
import DataChangeEvent from './DataChangeEvent';

/**
 * Base class for Observable objects.  Objects implementing the Observer interface can
 * listen to changes in the observable object.  Observable objects are themselves observers.
 * This allows data changed events to populate up a chain of observers.
 */
export default class Observable<T extends DataChangeEvent> {
    @Ignore
    private _callbacks : DataChangeCallback<T>[] = [];

    /**
     * Add a change listener.
     * @param callback Function that is called when the object changes.
     */
    addChangeListener(callback : DataChangeCallback<T>) : DataChangeCallback<T> {
        this._callbacks.push(callback);
        return callback;
    }

    /**
     * Remove a change listener.
     * @param callback Function object that was registered with addChangeListener.
     */
    removeChangeListener(callback : DataChangeCallback<T>) {
        var index = this._callbacks.indexOf(callback);
        if (index >= 0) {
            this._callbacks.splice(index, 1);
        }
    }

    /**
     * Publish the data changed event to all listeners.
     * @param event The event that will be published.
     */
    protected publishDataChanged(event : T) {
        for (var i = 0; i < this._callbacks.length; i++) {
            this._callbacks[i](event);
        }
    }
}
