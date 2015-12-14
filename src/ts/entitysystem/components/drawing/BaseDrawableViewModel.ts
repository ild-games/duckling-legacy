module entityframework.components.drawing {
    /**
     * Base ViewModel for all used by all Drawable ViewModels.
     */
    export class BaseDrawableViewModel<T> extends framework.ViewModel<T> {
        isWhite : boolean = true;
    }
}
