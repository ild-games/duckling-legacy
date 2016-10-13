import {Vector, vectorAbsolute} from '../../math/vector';
import {Entity} from '../../entitysystem/entity';
import {immutableAssign} from '../../util/model';
import {AssetService} from '../../project/asset.service';

import {CollisionAttribute, getCollision} from './collision-attribute';
import {collisionBoundingBox} from './collision-box';

export function setCollisionSize(entity : Entity, newSize : Vector, assetService : AssetService) : CollisionAttribute {
    let collisionAttribute = getCollision(entity);
    let dimensionObj = immutableAssign(collisionAttribute.dimension, {dimension: vectorAbsolute(newSize)});
    return immutableAssign(collisionAttribute, {dimension: dimensionObj});
}

export function getCollisionSize(entity : Entity, assetService : AssetService) : Vector {
    return collisionBoundingBox(entity).dimension;
}
