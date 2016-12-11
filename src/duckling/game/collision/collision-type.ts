import {Entity} from '../../entitysystem/entity';

import {getCollision} from './collision-attribute';

/**
 * Get the collision type out of a collision attribute for a specific entity
 */
export function collisionType(entity : Entity) : string {
    let collisionAttribute = getCollision(entity);
    if (!collisionAttribute) {
        return null;
    }
    return collisionAttribute.collisionType;
}