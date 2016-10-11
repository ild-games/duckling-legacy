import {CollisionAttribute} from './collision-attribute';
import {Box2, Vector, vectorAdd, vectorSubtract, vectorAbsolute, vectorMultiply, vectorDivide} from '../../math';
import {immutableAssign} from '../../util';

export function resizeCollision(attribute : CollisionAttribute, lastCoords : Vector, curCoords : Vector, position : Vector) : CollisionAttribute {
    let curCollisionDimension = vectorDivide(attribute.dimension.dimension, {x: 2, y: 2});
    let collisionDimensionOffset = vectorSubtract(vectorAbsolute(vectorSubtract(lastCoords, position)), curCollisionDimension);

    let dimensionObj = immutableAssign(
        attribute.dimension,
        {dimension: vectorMultiply(vectorSubtract(vectorAbsolute(vectorSubtract(curCoords, position)), collisionDimensionOffset), {x: 2, y: 2})});
    if (dimensionObj.dimension.x < 0) {
        dimensionObj.dimension.x = 0;
    }
    if (dimensionObj.dimension.y < 0) {
        dimensionObj.dimension.y = 0;
    }
    return immutableAssign(attribute, {dimension: dimensionObj});
}
