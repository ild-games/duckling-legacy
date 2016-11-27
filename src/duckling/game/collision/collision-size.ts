import {Vector, vectorAbsolute, vectorSign, vectorMultiply, vectorDivide, vectorToFixed} from '../../math/vector';
import {Entity} from '../../entitysystem/entity';
import {immutableAssign} from '../../util/model';
import {AssetService} from '../../project/asset.service';

import {CollisionAttribute, getCollision} from './collision-attribute';
import {collisionBoundingBox} from './collision-box';

export function setCollisionSize(entity : Entity, newSize : Vector, fixedNum : number, assetService : AssetService) : CollisionAttribute {
    let collisionAttribute = getCollision(entity);
    let scaleSign = vectorSign(collisionAttribute.scale);
    let oldScale = vectorAbsolute(collisionAttribute.scale);
    let oldSize = vectorAbsolute(getCollisionSize(entity, assetService));
    let newScale = vectorToFixed(vectorAbsolute(vectorDivide(vectorMultiply(oldScale, newSize), oldSize)), fixedNum);
    if (_isValidScale(newScale)) {
        return immutableAssign(collisionAttribute, {scale: newScale});
    }
    return collisionAttribute;
}

export function getCollisionSize(entity : Entity, assetService : AssetService) : Vector {
    return collisionBoundingBox(entity).dimension;
}

function _isValidScale(scale : Vector) : boolean {
    return (
        !isNaN(scale.x) && !isNaN(scale.y) &&
        isFinite(scale.x) && isFinite(scale.y) &&
        scale.x !== 0  && scale.y !== 0
    );
}
