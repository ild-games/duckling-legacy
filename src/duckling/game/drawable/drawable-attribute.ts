import {Attribute} from '../../entitysystem/entity';

export const DRAWABLE_KEY = "drawable";

export enum DrawableType {
    Shape,
    Container
}

/**
 * Applied on entities that have drawables.
 */
export interface DrawableAttribute extends Attribute {
    /**
     * Determines which type of drawable is being used
     */
    type : DrawableType;
}

export var defaultDrawable : DrawableAttribute = {
    type: null
};
