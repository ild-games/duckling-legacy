import {roundToMultiple} from '../../math/number-utils';
import {Vector, vectorModulus, vectorAdd, vectorMultiply} from '../../math/vector';
import {Box2} from '../../math/box2';

const SNAP_FRACTION = 2;

/**
 * Get the minimum snap distance for the given corners
 */
export function minCornerSnapDistance(movementDestinationWithoutSnap : Vector, box : Box2, gridSize : Vector) : Vector {
    return {
        x : _getDistance(movementDestinationWithoutSnap.x, box.dimension.x, gridSize.x / SNAP_FRACTION),
        y : _getDistance(movementDestinationWithoutSnap.y, box.dimension.y, gridSize.y / SNAP_FRACTION)
    }
}

/**
 * Snap a position to the grid.
 */
export function snapPosition(position : Vector, gridSize : Vector) : Vector {
    return {
        x: roundToMultiple(position.x, gridSize.x / SNAP_FRACTION),
        y: roundToMultiple(position.y, gridSize.y / SNAP_FRACTION)
    }
}

export function _getDistance(position : number, size : number, gridSize : number) : number {
    let leftPosition = position;
    let rightPosition = position + size;
    let leftSnapDistance = roundToMultiple(leftPosition, gridSize) - leftPosition;
    let rightSnapDistance = roundToMultiple(rightPosition, gridSize) - rightPosition;

    if (Math.abs(leftSnapDistance) < Math.abs(rightSnapDistance)) {
        return leftSnapDistance;
    } else {
        return rightSnapDistance;
    }
}
