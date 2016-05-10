import {Vector} from './vector';

/**
 * Represents a collideable bounding box.
 */
export interface Box2 {
    position : Vector;
    dimension : Vector;
    rotation : number;
}

/**
 * Check if the point is contained in the box. Returns false if box or position are null.
 * @param box      The box that may or may not contain the point.
 * @param position The position to test if it is in the box.
 * @return True if the box contains the point, false otherwise.
 */
export function boxContainsPoint(box : Box2, position : Vector) {
    //TODO https://github.com/JeffSwenson/duckling/issues/28 Support Rotation
    if (!box || !position) {
        return false;
    }
    return (boxMinX(box) <= position.x && position.x <= boxMaxX(box))
        && (boxMinY(box) <= position.y && position.y <= boxMaxY(box));
}

/**
 * Get the minimal box that contains the left and right boxes.
 * @return A new Box2 instance.
 */
export function boxUnion(left : Box2, right : Box2) : Box2 {
    var minX = Math.min(boxMinX(left), boxMinX(right));
    var maxX = Math.min(boxMaxX(left), boxMaxX(right));
    var minY = Math.min(boxMinY(left), boxMinY(right));
    var maxY = Math.min(boxMaxY(left), boxMaxY(right));
    return boxFromEdges(minX, maxX, minY, maxY);
}

/**
 * Get the minimum X position that a box touches.
 */
export function boxMinX(box : Box2) : number {
    return box.position.x - box.dimension.x / 2;
}

/**
 * Get the maximum X position that a box touches.
 */
export function boxMaxX(box : Box2) : number {
    return box.position.x + box.dimension.x / 2;
}

/**
 * Get the minimum Y position that a box touches.
 */
export function boxMinY(box : Box2) : number {
    return box.position.y - box.dimension.y / 2;
}

/**
 * Get the maximum Y position that a box touches.
 */
export function boxMaxY(box : Box2) : number {
    return box.position.y + box.dimension.y / 2;
}

/**
 * Create a box given its minimum and maximum positions.
 * @return A new Box2 object.
 */
export function boxFromEdges(minX : number, maxX : number, minY : number, maxY : number) : Box2 {
    var dimension = {x : maxX - minX, y : maxY - minY};
    var position = {x : (maxX + minX) / 2, y : (maxY + minY) / 2};
    return {dimension, position, rotation : 0};
}
