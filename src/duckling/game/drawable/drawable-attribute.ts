import { Attribute, Entity, TaggedEntity } from '../../entitysystem/entity';
import { immutableAssign } from '../../util';

import { Drawable } from './drawable';
import { defaultContainerDrawable } from './container-drawable';
import { defaultShapeDrawable } from './shape-drawable';
import { defaultShape } from './shape';
import { defaultRectangle } from './rectangle';

export const DRAWABLE_KEY = "drawable";

/**
 * Applied on entities that have drawables.
 */
export interface DrawableAttribute extends Attribute {
    /**
     * Determines which type of drawable is being used
     */
    topDrawable : Drawable;
    
    camEntity: string;
}

export let defaultDrawableAttribute : DrawableAttribute = immutableAssign({}, {
    topDrawable: _defaultTopDrawable(),
    camEntity: ""
}) as DrawableAttribute;

function _defaultTopDrawable() : Drawable {
    let innerShape = immutableAssign(defaultRectangle, {});
    let innerShapeDrawable = immutableAssign(defaultShapeDrawable, { 
        key: "ShapeDrawable1",
        shape: innerShape 
    });
    return immutableAssign(defaultContainerDrawable, { 
        key: "TopDrawable",
        drawables: [innerShapeDrawable] 
    });
}

/**
 * Retrieve the drawable attribute from the entity.
 * @param  entity Entity the component will be retrieved from.
 * @return Drawable attribute belonging to the entity.
 */
export function getDrawableAttribute(entity : Entity) : DrawableAttribute {
    return <DrawableAttribute>entity[DRAWABLE_KEY];
}

/**
 * Given two entities with drawable attribute, provide a sorting algorithm
 */
export function drawableAttributeSorter(entity1 : TaggedEntity, entity2 : TaggedEntity) {
    let drawable1 : DrawableAttribute = getDrawableAttribute(entity1.entity);
    let drawable2 : DrawableAttribute = getDrawableAttribute(entity2.entity);
    if (drawable1.topDrawable.renderPriority > drawable2.topDrawable.renderPriority) {
        return 1;
    }
    if (drawable1.topDrawable.renderPriority < drawable2.topDrawable.renderPriority) {
        return -1;
    }
    return 0;
}
