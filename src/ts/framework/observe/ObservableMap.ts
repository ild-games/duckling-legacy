module framework.observe {

    import serialize = util.serialize;
    import CustomSerializer = serialize.CustomSerializer;

    const EVENT_CHILD_CHANGED = "ChildChanged";
    const EVENT_CHILD_ADD = "Added";
    const EVENT_CHILD_REMOVED = "Removed";

    export class ObservableMapChanged<T extends Observable<any>> extends DataChangeEvent {
        key : string;
        item : T;

        constructor(object : ObservableMap<T>, name : string, key : string, item? : T, child? : DataChangeEvent) {
            super(name,  object, child);
            this.key = key;
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
     * Map of observable objects.  Changes to objects contained in the map will be
     * propagated to any object listening to the map.
     */
    @util.serialize.HasCustomSerializer
    export class ObservableMap<T extends Observable<any>> extends Observable<ObservableMapChanged<T>> implements CustomSerializer {
        private data : { [key:string]: T} = {};
        private callbacks : { [key:string] : DataChangeCallback<ObservableMapChanged<T>> } = {};
        private valueFactory : Function;


        /**
         * Produce an empty ObservableMap.
         * @param valueFactory A function that can be used to initialize one
         * of the objects mapped to. Used during the deserialization process to
         * produce objects of the correct type.
         */
        constructor(valueFactory? : Function) {
            super();
            this.valueFactory = valueFactory;
        }

        /**
         * Put an object in the map.
         * @param key Key of the object.
         * @param object Object to be stored.
         * @returns The object that was previously stored in the map.
         */
        put(key : string, object : T) : T {
            var old;
            if (this.data[key]) {
                old = this.remove(key);
            }

            this.callbacks[key] = (event : DataChangeEvent) => {
                this.publishDataChanged(new ObservableMapChanged(this, EVENT_CHILD_CHANGED, key, object, event));
            };

            object.addChangeListener(this.callbacks[key]);
            this.data[key] = object;
            this.publishDataChanged(new ObservableMapChanged(this, EVENT_CHILD_ADD, key, object));
            return old || null;
        }

        /**
         * Return the object if it is stored in the map.
         * @param key Key the object is stored under.
         * @returns The object if it exists.  Otherwise null.
         */
        get(key : string) : T {
            return this.data[key] || null;
        }

        /**
         * Remove an object from the map.
         * @param key Key of the object to remove.
         * @returns Object the map contained at the key.  Null if there
         * was no object.
         */
        remove(key : string) : T {
            var object = this.data[key];
            if (object) {
                object.removeChangeListener(this.callbacks[key]);
                delete this.data[key];
                delete this.callbacks[key];
                this.publishDataChanged(new ObservableMapChanged(this, EVENT_CHILD_REMOVED, key, object));
            }
            return object || null;
        }

        /**
         * Iterate over all of the objects in the map.
         * @param func Function that will be called for all map entries.
         */
        forEach(func : (object : T, key? : string) => void) {
            for(var key in this.data) {
                var object = this.data[key];
                if (object) {
                    func(object, key);
                }
            }
        }


        //region CustomSerializer implementation
        /**
         * @see util.serialize.CustomSerializer.toJSON
         */
        toJSON() {
            return this.data;
        }

        /**
         * @see util.serialize.CustomSerializer.fromJSON
         */
        fromJSON(object):any {
            var child;
            for (var key in object) {
                if (this.valueFactory) {
                    child = serialize.buildTypesFromObjects(object[key], this.valueFactory());
                } else {
                    child = serialize.buildTypesFromObjects(object[key]);
                }
                this.put(key, child);
            }
            return this;
        }
        //endregion
    }
}
