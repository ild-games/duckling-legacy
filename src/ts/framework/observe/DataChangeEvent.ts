import Observable from './Observable';

/**
 * An event that describes how the data in an observable object changed.
 */
export default class DataChangeEvent {
    name : string;
    child : DataChangeEvent;
    object : Observable<any>;

    /**
     * Initialize the event.
     * @param name Name of the data changed event. (EX: "ElementRemoved", "ElementModified")
     * @param object Object that the event corresponds to.
     * @param child Child event that triggered the event.
     */
    constructor(name : string, object : Observable<any>, child? : DataChangeEvent) {
        this.name = name;
        this.child = child;
        this.object = object;
    }
}
