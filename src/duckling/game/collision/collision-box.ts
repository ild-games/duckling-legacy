import {Entity} from '../../entitysystem/entity';
import {AssetService} from '../../project';
import {getPosition} from '../position/position-attribute';
import {Box2} from '../../math';

import {getCollision} from './collision-attribute';

/**
 * Get the bounding box for an entity with a collision attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's collision attribute.
 */
export function collisionBoundingBox(entity : Entity, assetService : AssetService) : Box2 {
    var positionAttribute = getPosition(entity);
    var collisionAttribute = getCollision(entity);
    return {
        position: positionAttribute.position,
        dimension: collisionAttribute.dimension.dimension,
        rotation: collisionAttribute.dimension.rotation
    }
}
