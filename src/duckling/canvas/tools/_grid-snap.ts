import {roundToMultiple} from '../../math/number-utils';
import {Vector, vectorModulus, vectorAdd, vectorMultiply} from '../../math/vector';
import {Box2} from '../../math/box2';

/**
 * Get the minimum snap distance for the given corners
 */
export function minCornerSnapDistance(movementDestinationWithoutSnap : Vector, box : Box2, gridSize : Vector) : Vector {
    let minSnap = {x : gridSize.x, y : gridSize.y};
    const snapFraction = 2;
    return {
        x : -_getDistance(movementDestinationWithoutSnap.x, box.dimension.x, gridSize.x / snapFraction),
        y : -_getDistance(movementDestinationWithoutSnap.y, box.dimension.y, gridSize.y / snapFraction)
    }
}

export function _getDistance(position : number, size : number, gridSize : number) : number {
    let leftPosition = position - size / 2;
    let rightPosition = position + size / 2;
    let leftSnapDistance = roundToMultiple(leftPosition, gridSize) - leftPosition;
    let rightSnapDistance = roundToMultiple(rightPosition, gridSize) - rightPosition;

    if (Math.abs(leftSnapDistance) < Math.abs(rightSnapDistance)) {
        return leftSnapDistance;
    } else {
        return rightSnapDistance;
    }
}
