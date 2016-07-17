import {Attribute, Entity} from '../../entitysystem/entity';
import {immutableAssign} from '../../util';

import {Drawable, defaultDrawable} from './drawable';

export const DRAWABLE_KEY = "drawable";

/**
 * Applied on entities that have drawables.
 */
export interface DrawableAttribute extends Attribute {
    /**
     * Determines which type of drawable is being used
     */
    topDrawable : Drawable;
}

export var defaultDrawableAttribute : DrawableAttribute = immutableAssign({}, {topDrawable: defaultDrawable}) as DrawableAttribute;

/**
 * Retrieve the drawable attribute from the entity.
 * @param  entity Entity the component will be retrieved from.
 * @return Drawable attribute belonging to the entity.
 */
export function getDrawableAttribute(entity : Entity) : DrawableAttribute {
    return <DrawableAttribute>entity[DRAWABLE_KEY];
}
