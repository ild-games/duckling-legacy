module framework.observe {
    /**
     * An event that describes how the data in an observable object changed.
     */
    export class DataChangeEvent {
        name : string;
        child : DataChangeEvent;
        object;
        data;

        /**
         * Initialize the event.
         * @param data Data describing the event.
         * @param name Name of the data changed event. (EX: "ElementRemoved", "ElementModified")
         * @param child Child event that triggered the event.
         * @param object Object that the event corresponds to.
         */
        constructor(data, name : string, child : DataChangeEvent, object : Observable) {
            this.data = data;
            this.name = name;
            this.child = child;
            this.object = object;
        }
    }
}
