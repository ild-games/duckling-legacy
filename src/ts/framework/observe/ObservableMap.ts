module framework.observe {

    import CustomSerializer = util.serialize.CustomSerializer;

    /**
     * Map of observable objects.  Changes to objects contained in the map will be
     * propagated to any object listening to the map.
     */
    @util.serialize.HasCustomSerializer
    export class ObservableMap<T extends Observable> extends Observable implements CustomSerializer {
        private _data : { [key:string]: T} = {};

        /**
         * Put an object in the map.
         * @param key Key of the object.
         * @param object Object to be stored.
         * @returns The object that was previously stored in the map.
         */
        put(key : string, object : T) : T {
            var old;
            if (this._data[key]) {
                old = this.remove(key);
            }
            object.listenForChanges(key, this);
            this._data[key] = object;
            this.dataChanged("Added", object);
            return old || null;
        }

        /**
         * Return the object if it is stored in the map.
         * @param key Key the object is stored under.
         * @returns The object if it exists.  Otherwise null.
         */
        get(key : string) : T{
            return this._data[key] || null;
        }

        /**
         * Remove an object from the map.
         * @param key Key of the object to remove.
         * @returns Object the map contained at the key.  Null if there
         * was no object.
         */
        remove(key : string) : T {
            var object = this._data[key];
            if (object) {
                delete this._data[key];
                object.stopListening(key, this);
                this.dataChanged("Removed", object);
            }
            return object || null;
        }

        /**
         * Iterate over all of the objects in the map.
         * @param func Function that will be called for all map entries.
         */
        forEach(func : (object : T, key? : string) => void) {
            for(var key in this._data) {
                var object = this._data[key];
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
            return this._data;
        }

        /**
         * @see util.serialize.CustomSerializer.fromJSON
         */
        fromJSON(object):any {
            for (var key in object) {
                this.put(key, object[key]);
            }
            return this;
        }
        //endregion
    }
}