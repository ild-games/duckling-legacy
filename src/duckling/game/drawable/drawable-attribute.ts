import {Attribute, Entity} from '../../entitysystem/entity';

import {Drawable} from './drawable';

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

export var defaultDrawableAttribute : DrawableAttribute = {
    topDrawable: {
        type: null,
        renderPriority: 0,
        scale: {
            x: 1,
            y: 1
        },
        rotation: 0,
        bounds: {
            x: 0,
            y: 0
        }
    }
};

/**
 * Retrieve the drawable attribute from the entity.
 * @param  entity Entity the component will be retrieved from.
 * @return Drawable attribute belonging to the entity.
 */
export function getDrawableAttribute(entity : Entity) : DrawableAttribute {
    return <DrawableAttribute>entity[DRAWABLE_KEY];
}
