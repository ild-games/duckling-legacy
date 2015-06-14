module framework.observe {
    /**
     * Objects should implement this interface if they want to listen for changes in other
     * model objects.
     */
    export interface Observer {
        /**
         * Called when an observed object changes.
         * @param key Key that the observer is listening on.
         * @param event Event describing how the object chagned.
         */
        onDataChanged(key: string, event : DataChangeEvent);
    }
}