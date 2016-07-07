import {Entity} from '../../entitysystem/entity';
import {getPosition} from '../position/position-attribute';
import {Box2} from '../../math';

import {getDrawableAttribute} from './drawable-attribute';

/**
 * Get the bounding box for an entity with a drawable attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's drawable attribute.
 */
export function drawableBoundingBox(entity : Entity) : Box2 {
    var positionAttribute = getPosition(entity);
    var drawableAttribute = getDrawableAttribute(entity);

    if (!drawableAttribute.topDrawable.bounds) {
        return {
            position: {x: 0, y: 0},
            dimension: {x: 0, y: 0},
            rotation: 0
        };
    }

    return {
        position: positionAttribute.position,
        dimension: drawableAttribute.topDrawable.bounds,
        rotation: drawableAttribute.topDrawable.rotation
    }
}
