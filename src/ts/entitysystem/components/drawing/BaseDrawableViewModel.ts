module entityframework.components.drawing {
    /**
     * Base ViewModel for all used by all Drawable ViewModels.
     */
    export class BaseDrawableViewModel<T> extends framework.ViewModel<T> implements framework.observe.Observer {
        isWhite : boolean = true;

        onDataChanged(key : string, event : framework.observe.DataChangeEvent) { }
    }
}
