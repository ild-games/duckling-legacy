/**
 * Interface that needs to be implemented in order to render items in a ListVM.
 */
interface ListAdapter<T> {
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
    getItem(index : number) : T,

    /**
     * Optional method that can be implemented if a template is provided to wrap the list items. If
     * implemented the object returned by this method will be provided when the template is inflated.
     * In the template the object can be retrieved using the "extras" local variable.
     * @param index Index of the item that is being inflated.
     */
    getItemExtras? : (index : number) => Object;
}
export {ListAdapter as default};
