///<reference path="Observable.ts"/>
module framework.observe {

    import serialize = util.serialize;
    import CustomSerializer = serialize.CustomSerializer;

    /**
     * An array that implements the observer interface.
     */
    export class ObservableArray<T extends Observable> extends Observable  implements CustomSerializer {
        private _data : T[] = [];
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
        }

        /**
         * Push the object onto the back of the array.
         * @param object The object being added to the array.
         */
        push(object : T) {
            var index = this._data.length;
            this._data.push(object);
            object.listenForChanges(index.toString(), this);
            this.dataChanged("Added", object);
        }

        /**
         * Get the object at the given index.
         * @param index Index that the object is stored at.
         * @returns The object at the given index.
         */
        at(index : number) {
            return this._data[index];
        }

        /**
         * Pop the object off the back of the array and return it.
         * @returns The object that was at the back of the list.
         */
        popBack() {
            var object : T = this._data.pop();
            object.stopListening(this._data.length.toString(), this);
            this.dataChanged("Removed", object);
            return object;
        }

        /**
         * Allows iterating over the objects in the array.
         * @param func
         */
        forEach(func : (object : T, index? : number ) => void) {
            this._data.forEach(func);
        }

        //region Getters and Setters
        get length() {
            return this._data.length;
        }

        /**
         * @see util.serialize.CustomSerializer.toJSON
         */
        toJSON() {
            return this._data;
        }

        /**
         * @see util.serialize.CustomSerializer.fromJSON
         */
        fromJSON(object) : any {
            var child;
            for (var index in object.size) {
                if (this.valueConstructor) {
                    child = serialize.buildTypesFromObjects(object[index],new this.valueConstructor());
                } else {
                    child = serialize.buildTypesFromObjects(object[index]);
                }
                this.push(child);
            }
            return this;
        }
        //endregion
    }
}