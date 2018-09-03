import { Vector } from "./vector";

/**
 * Represents a collideable bounding box.
 */
export interface Box2 {
    position: Vector;
    dimension: Vector;
    rotation: number;
}

/**
 * An empty Box2 for initialization
 */
export const EMPTY_BOX: Box2 = {
    position: { x: 0, y: 0 },
    dimension: { x: 0, y: 0 },
    rotation: 0,
};

/**
 * Check if the point is contained in the box. Returns false if box or position are null.
 * @param box      The box that may or may not contain the point.
 * @param position The position to test if it is in the box.
 * @return True if the box contains the point, false otherwise.
 */
export function boxContainsPoint(box: Box2, position: Vector) {
    //TODO https://github.com/JeffSwenson/duckling/issues/28 Support Rotation
    if (!box || !position) {
        return false;
    }
    return (
        boxMinX(box) <= position.x &&
        position.x <= boxMaxX(box) &&
        (boxMinY(box) <= position.y && position.y <= boxMaxY(box))
    );
}

export function boxContainsBox(outerBox: Box2, innerBox: Box2) {
    if (!outerBox || !innerBox) {
        return false;
    }

    return (
        boxMinX(outerBox) <= boxMinX(innerBox) &&
        boxMaxX(innerBox) <= boxMaxX(outerBox) &&
        (boxMinY(outerBox) <= boxMinY(innerBox) &&
            boxMaxY(innerBox) <= boxMaxY(outerBox))
    );
}

/**
 * Get the minimal box that contains the left and right boxes.
 * @return A new Box2 instance.
 */
export function boxUnion(left: Box2, right: Box2): Box2 {
    let minX = Math.min(boxMinX(left), boxMinX(right));
    let maxX = Math.max(boxMaxX(left), boxMaxX(right));
    let minY = Math.min(boxMinY(left), boxMinY(right));
    let maxY = Math.max(boxMaxY(left), boxMaxY(right));
    return boxFromEdges(minX, maxX, minY, maxY);
}

/**
 * Get the minimum X position that a box touches.
 */
export function boxMinX(box: Box2): number {
    return box.position.x;
}

/**
 * Get the maximum X position that a box touches.
 */
export function boxMaxX(box: Box2): number {
    return box.position.x + box.dimension.x;
}

/**
 * Get the minimum Y position that a box touches.
 */
export function boxMinY(box: Box2): number {
    return box.position.y;
}

/**
 * Get the maximum Y position that a box touches.
 */
export function boxMaxY(box: Box2): number {
    return box.position.y + box.dimension.y;
}

/**
 * Create a box given its minimum and maximum positions.
 * @return A new Box2 object.
 */
export function boxFromEdges(
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
): Box2 {
    let dimension = { x: maxX - minX, y: maxY - minY };
    let position = { x: minX, y: minY };
    return { dimension, position, rotation: 0 };
}

/**
 * Create a box given a width and height
 * @param  width of the box
 * @param  height of the box
 * @return A new Box2 object
 */
export function boxFromWidthHeight(width: number, height: number) {
    return {
        position: { x: 0, y: 0 },
        dimension: {
            x: width,
            y: height,
        },
        rotation: 0,
    };
}

export function normalizeBox(box: Box2): Box2 {
    if (box.dimension.x < 0) {
        box.position.x += box.dimension.x;
        box.dimension.x = Math.abs(box.dimension.x);
    }
    if (box.dimension.y < 0) {
        box.position.y += box.dimension.y;
        box.dimension.y = Math.abs(box.dimension.y);
    }

    return box;
}
