module framework.listvm {
    export interface ListAdapter {
        length : number,
        renderItem(index : number, root : HTMLElement),
        detachItem(index : number, root : HTMLElement)
    }
}
