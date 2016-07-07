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
        __cpp_type: null,
        type: null,
        key: "TopDrawable",
        inactive: false,
        renderPriority: 0,
        scale: {
            x: 1,
            y: 1
        },
        rotation: 0,
        bounds: {
            x: 0,
            y: 0
        },
        positionOffset: {
            x: 0,
            y: 0
        },
        priorityOffset: 0
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
