///<reference path="Observable.ts"/>
module framework.observe {

    import serialize = util.serialize;
    import CustomSerializer = serialize.CustomSerializer;

    const EVENT_CHILD_CHANGED = "ChildChanged";
    const EVENT_CHILD_ADD = "Added";
    const EVENT_CHILD_REMOVED = "Removed";

    export class ObservableArrayChanged<T extends Observable<any>> extends DataChangeEvent {
        item : T;

        constructor(object : ObservableArray<T>, name : string, item? : T, child? : DataChangeEvent) {
            super(name,  object, child);
            this.item = item;
        }

        /**
         * Check the event to see if removing an item caused it.
         */
        get isItemRemoved() {
            return this.name === EVENT_CHILD_REMOVED;
        }

        /**
         * Check the event to see if adding an item caused it.
         */
        get isItemAdded() {
            return this.name === EVENT_CHILD_ADD;
        }

        /**
         * Check the event to see if changing an item in the map caused it.
         */
        get isItemChanged() {
            return this.name === EVENT_CHILD_CHANGED;
        }
    }

    /**
     * An array that implements the observer interface.
     */
    @util.serialize.HasCustomSerializer
    export class ObservableArray<T extends Observable<any>> extends Observable<ObservableArrayChanged<T>> implements CustomSerializer {
        private data : T[] = [];
        private listener : DataChangeCallback<ObservableArrayChanged<T>>;
        private valueConstructor : any;

        /**
         * Produce an empty ObservableMap.
         * @param valueConstructor A constructor that can be used to initialize
         * the objects stored in the array. Used during the deserialization process
         * to produce objects of the correct type.
         */
        constructor(valueConstructor? : Function) {
            super();
            this.valueConstructor = valueConstructor;
            this.listener = (event) => {
                this.publishDataChanged(new ObservableArrayChanged(this, EVENT_CHILD_CHANGED, <any>event.object));
            }
        }

        /**
         * Push the object onto the back of the array.
         * @param object The object being added to the array.
         */
        push(object : T) {
            var index = this.data.length;
            this.data.push(object);
            object.addChangeListener(this.listener);
            this.publishDataChanged(new ObservableArrayChanged(this, EVENT_CHILD_ADD, object));
        }

        /**
         * Get the object at the given index.
         * @param index Index that the object is stored at.
         * @returns The object at the given index.
         */
        at(index : number) {
            return this.data[index];
        }

        /**
         * Pop the object off the back of the array and return it.
         * @returns The object that was at the back of the list.
         */
        popBack() {
            var object : T = this.data.pop();
            object.removeChangeListener(this.listener);
            this.publishDataChanged(new ObservableArrayChanged(this, EVENT_CHILD_REMOVED, object));
            return object;
        }

        /**
         * Removes a specified object off the array.
         * @param object The object to remove.
         */
        remove(object : T) {
            var index = this.data.indexOf(object);
            if (index >= 0) {
                this.data.splice(index, 1);
                object.removeChangeListener(this.listener);
            }
            this.publishDataChanged(new ObservableArrayChanged(this, EVENT_CHILD_REMOVED, object));
        }

        /**
         * Allows iterating over the objects in the array.
         * @param func
         */
        forEach(func : (object : T, index? : number ) => void) {
            this.data.forEach(func);
        }

        //region Getters and Setters
        get length() {
            return this.data.length;
        }

        /**
         * @see util.serialize.CustomSerializer.toJSON
         */
        toJSON(context : serialize.SerializationContext) {
            return this.data;
        }

        /**
         * @see util.serialize.CustomSerializer.fromJSON
         */
        fromJSON(object, context : serialize.SerializationContext) : any {
            var child;
            object.forEach((element, index) => {
                if (this.valueConstructor) {
                    child = context.initInstance(element, new this.valueConstructor(), index);
                } else {
                    child = context.initInstance(element, null, index);
                }
                this.push(child);
            });
            return this;
        }
        //endregion
    }
}
