module entityframework.components.drawing {
    export interface DrawableFactory {
        createFormVM() : framework.ViewModel<any>;

        createDrawable(key : string) : Drawable;
    }
}
