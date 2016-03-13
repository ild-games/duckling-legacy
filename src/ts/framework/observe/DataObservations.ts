import Observable from './Observable';
import DataChangeEvent from './DataChangeEvent';
import DataChangeCallback from './DataChangeCallback';

interface Observation {
    object : Observable<any>;
    callback : DataChangeCallback<any>;
}

export default class DataObservations {
    private dataObservations : Observation[] = [];

    /**
     * Add a change listner to the object. The change listner will automatically be cleaned up when the object is
     * destroyed.
     * @param object Object that will be observed.
     * @param callback Callback that will be fired on data change.
     */
    setChangeListener<T extends DataChangeEvent>(object : Observable<T>, callback : DataChangeCallback<T>) {
        this.dataObservations.push({
            object: object,
            callback: callback
        });

        object.addChangeListener(callback);
    }

    /**
     * Remove all of the attached change listeners.
     */
    removeChangeListeners() {
        for (var i = 0; i < this.dataObservations.length; i++) {
            var observation = this.dataObservations[i];
            observation.object.removeChangeListener(observation.callback);
        }
        this.dataObservations= [];
    }

    /**
     * Remove one change listener from the object.
     * @param object Object that is being listened to for chagnes by the view model.
     */
    removeChangeListener(object) {
        for(var i = 0; i < this.dataObservations.length; i++) {
            var observation = this.dataObservations[i];
            if (observation.object === object) {
                this.dataObservations.slice(i,1);
                observation.object.removeChangeListener(observation.callback);
                break;
            }
        }
    }
}
