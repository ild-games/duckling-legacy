import {Entity} from '../../entitysystem/entity';
import {getPosition} from '../position/position-attribute';
import {Box2} from '../../math';

import {drawDrawableAttribute} from './drawable-drawer';

/**
 * Get the bounding box for an entity with a drawable attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's drawable attribute.
 */
export function drawableBoundingBox(entity : Entity) : Box2 {
    let positionAttribute = getPosition(entity);
    let entityDisplayObject = drawDrawableAttribute(entity);

    if (!positionAttribute || !entityDisplayObject) {
        return {
            position: {x: 0, y: 0},
            dimension: {x: 0, y: 0},
            rotation: 0
        };
    }
    let bounds = entityDisplayObject.getBounds();

    return {
        position: positionAttribute.position,
        dimension: {
            x: bounds.width,
            y: bounds.height
        },
        rotation: 0
    }
}
