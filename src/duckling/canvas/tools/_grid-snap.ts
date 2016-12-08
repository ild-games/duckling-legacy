import {Vector, vectorModulus, vectorAdd, vectorMultiply} from '../../math/vector';
import {Box2} from '../../math/box2';

/**
 * All the distances corners would need to snap to for grid points
 */
interface CornersSnapDistance {
    topLeft: Vector,
    topRight: Vector,
    bottomLeft: Vector,
    bottomRight: Vector,
    middle : Vector,
    topMiddle : Vector,
    rightMiddle : Vector,
    bottomMiddle : Vector,
    leftMiddle : Vector 
};

/**
 * Get the minimum snap distance for the given corners
 */
export function minCornerSnapDistance(movementDestinationWithoutSnap : Vector, box : Box2, gridSize : Vector) : Vector {
    let cornersSnapDistance = _cornersSnapDistance(movementDestinationWithoutSnap, box, gridSize);
    let topLeftHypotenus = _cornerSnapHypotenus(cornersSnapDistance.topLeft);
    let topRightHypotenus = _cornerSnapHypotenus(cornersSnapDistance.topRight);
    let bottomLeftHypotenus = _cornerSnapHypotenus(cornersSnapDistance.bottomLeft);
    let bottomRightHypotenus = _cornerSnapHypotenus(cornersSnapDistance.bottomRight);
    let middleHypotenus = _cornerSnapHypotenus(cornersSnapDistance.middle);
    let topMiddleHypotenus = _cornerSnapHypotenus(cornersSnapDistance.topMiddle);
    let rightMiddleHypotenus = _cornerSnapHypotenus(cornersSnapDistance.rightMiddle);
    let bottomMiddleHypotenus = _cornerSnapHypotenus(cornersSnapDistance.bottomMiddle);
    let leftMiddleHypotenus = _cornerSnapHypotenus(cornersSnapDistance.leftMiddle);
    let minHypotenus = Math.min(topLeftHypotenus, topRightHypotenus, bottomLeftHypotenus, bottomRightHypotenus, middleHypotenus, topMiddleHypotenus, rightMiddleHypotenus, bottomMiddleHypotenus, leftMiddleHypotenus);
    if (minHypotenus === topLeftHypotenus) {
        return cornersSnapDistance.topLeft;
    } else if (minHypotenus === topRightHypotenus) {
        return cornersSnapDistance.topRight;
    } else if (minHypotenus === bottomLeftHypotenus) {
        return cornersSnapDistance.bottomLeft;
    } else if (minHypotenus === bottomRightHypotenus) {
        return cornersSnapDistance.bottomRight;
    } else if (minHypotenus === middleHypotenus) {
        return cornersSnapDistance.middle;
    } else if (minHypotenus === topMiddleHypotenus) {
        return cornersSnapDistance.topMiddle;
    } else if (minHypotenus === rightMiddleHypotenus) {
        return cornersSnapDistance.rightMiddle;
    } else if (minHypotenus === bottomMiddleHypotenus) {
        return cornersSnapDistance.bottomMiddle;
    } else if (minHypotenus === leftMiddleHypotenus) {
        return cornersSnapDistance.leftMiddle;
    }
}

/**
 * Get the distance each corner would have to move in order to snap to the nearest grid point
 */
function _cornersSnapDistance(destinationWithoutSnap : Vector, box : Box2, gridSize : Vector) : CornersSnapDistance {
    return {
        topLeft:      _cornerSnapDistance({x: -1, y: -1}, destinationWithoutSnap, box, gridSize),
        topRight:     _cornerSnapDistance({x:  1, y: -1}, destinationWithoutSnap, box, gridSize),
        bottomLeft:   _cornerSnapDistance({x: -1, y:  1}, destinationWithoutSnap, box, gridSize),
        bottomRight:  _cornerSnapDistance({x:  1, y:  1}, destinationWithoutSnap, box, gridSize),
        middle:       _cornerSnapDistance({x:  0, y:  0}, destinationWithoutSnap, box, gridSize),
        topMiddle:    _cornerSnapDistance({x:  0, y: -1}, destinationWithoutSnap, box, gridSize),
        rightMiddle:  _cornerSnapDistance({x:  1, y:  0}, destinationWithoutSnap, box, gridSize),
        bottomMiddle: _cornerSnapDistance({x:  0, y:  1}, destinationWithoutSnap, box, gridSize),
        leftMiddle:   _cornerSnapDistance({x: -1, y:  0}, destinationWithoutSnap, box, gridSize),
    };
}

function _cornerSnapDistance(whichCorner : Vector, destinationWithoutSnap : Vector, box : Box2, gridSize : Vector) : Vector {
    let halfBoxSize = {x: box.dimension.x / 2, y: box.dimension.y / 2};
    let cornerDistance = vectorModulus(
        vectorAdd(destinationWithoutSnap, vectorMultiply(halfBoxSize, whichCorner)),
        gridSize);
    if (Math.abs(cornerDistance.x) > gridSize.x / 2) {
        cornerDistance.x = -Math.sign(cornerDistance.x) * (gridSize.x - Math.abs(cornerDistance.x));
    }
    if (Math.abs(cornerDistance.y) > gridSize.y / 2) {
        cornerDistance.y = -Math.sign(cornerDistance.y) * (gridSize.y - Math.abs(cornerDistance.y));
    }
    return cornerDistance;
}

function _cornerSnapHypotenus(cornerSnapDistance : Vector) : number {
    return Math.sqrt(Math.pow(cornerSnapDistance.x, 2) + Math.pow(cornerSnapDistance.y, 2));
}
