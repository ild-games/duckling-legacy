import {Vector} from './vector';

/**
 * Given an anchor get the position offset.
 * @return The position.
 */
export function anchorToPosition(anchor : Vector, size : Vector) {
    return {
        x: - size.x * anchor.x,
        y: - size.y * anchor.y
    }
}

/**
 * Given a position get the anchor.
 * @return The anchor.
 */
export function positionToAnchor(position: Vector, size : Vector) {
    return {
        x: size.x == 0 ? 0 : - position.x / size.x,
        y: size.y == 0 ? 0 : - position.y / size.y
    }
}
