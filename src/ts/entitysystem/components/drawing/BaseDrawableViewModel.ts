module entityframework.components.drawing {
    export class BaseDrawableViewModel<T> extends framework.ViewModel<T> implements framework.observe.Observer {
        isWhite : boolean = true;

        onDataChanged(key : string, event : framework.observe.DataChangeEvent) { }
    }
}
