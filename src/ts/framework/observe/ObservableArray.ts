///<reference path="Observable.ts"/>
module framework.observe {

    /**
     * An array that implements the observer interface.
     */
    export class ObservableArray<T extends Observable> extends Observable {
        private _data : T[] = [];

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
        //endregion
    }
}