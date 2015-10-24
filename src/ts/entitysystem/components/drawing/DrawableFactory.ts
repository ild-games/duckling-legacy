module entityframework.components.drawing {
    export interface DrawableFactory extends framework.VMFactory {
        createDrawable(key : string) : Drawable;
    }
}
