import DataChangeEvent from './DataChangeEvent';
import Observable from './Observable';

export default class SimpleObservable extends Observable<DataChangeEvent> {
    /**
    * Objects implementing Observable should call dataChanged when they want to notify change
    * listeners.
    * @param name Name describing the event.  Example: "Resized"
    * @param data Data that can be used to simplify the change processing.  Ex: {oldsize:#, newsize:#}
    */
    public dataChanged(name: string, data, child? : DataChangeEvent) {
        var event = new DataChangeEvent(name, this, child);
        this.publishDataChanged(event);
    }
}
