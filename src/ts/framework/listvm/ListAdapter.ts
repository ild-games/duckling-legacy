module framework.listvm {
    /**
     * Interface that needs to be implemented in order to render items in a ListVM.
     */
    export interface ListAdapter<T> {
        /**
         * The number of elements in the list.
         */
        length : number,
        /**
         * Get the ViewModel that should be used to render the item.
         * @param index
         */
        getItemVM(index : number),
        /**
         * Get the item stored at the index.
         * @param index Index that the item is stored in.
         */
        getItem(index : number) : T
    }
}
