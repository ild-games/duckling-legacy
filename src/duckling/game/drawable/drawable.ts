export enum DrawableType {
    Shape,
    Container
}

export interface Drawable {
    /**
     * Determines which type of drawable is being used
     */
    type : DrawableType;
}
