import {Entity} from '../../entitysystem/entity';
import {Box2} from '../../math';

import {getCollision} from './collision-attribute';

/**
 * Get the bounding box for an entity with a collision attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's collision attribute.
 */
export function collisionBoundingBox(entity : Entity) : Box2 {
    let collisionAttribute = getCollision(entity);
    if (!collisionAttribute) {
        return null;
    }
    return {
        position: {
            x: -(collisionAttribute.dimension.dimension.x * collisionAttribute.anchor.x),
            y: -(collisionAttribute.dimension.dimension.y * collisionAttribute.anchor.y)
        },
        dimension: collisionAttribute.dimension.dimension,
        rotation: collisionAttribute.dimension.rotation
    }
}
