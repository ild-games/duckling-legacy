import {Graphics, DisplayObject, Texture, Sprite} from 'pixi.js';
import {Box2} from '../../math/box2';
import {AssetService} from '../../project/asset.service';
import {Vector, vectorSubtract, vectorRotate} from '../../math/vector';
import {drawRectangle} from '../drawing';

export interface DragAnchor {
    location : Vector,
    dimension : Vector,
    rotation: number
}

export const DRAG_ANCHORS : DragAnchor [] = [
    {dimension: {x : 30, y : 20}, location: {x: 1, y: 0.5}, rotation: Math.PI / 4 * 0},
    {dimension: {x : 30, y : 20}, location: {x: 1, y: 1}, rotation: Math.PI / 4 * 1},
    {dimension: {x : 30, y : 20}, location: {x: 0.5, y: 1}, rotation: Math.PI / 4 * 2},
    {dimension: {x : 30, y : 20}, location: {x: 0, y: 1}, rotation: Math.PI / 4 * 3},
    {dimension: {x : 30, y : 20}, location: {x: 0, y: 0.5}, rotation: Math.PI / 4 * 4},
    {dimension: {x : 30, y : 20}, location: {x: 0, y: 0}, rotation: Math.PI / 4 * 5},
    {dimension: {x : 30, y : 20}, location: {x: 0.5, y: 0}, rotation: Math.PI / 4 * 6},
    {dimension: {x : 30, y : 20}, location: {x: 1, y: 0}, rotation: Math.PI / 4 * 7}
];

export function drawAnchor(box : Box2, anchor : DragAnchor, canvasZoom : number, assetService : AssetService) {
    let position = getAnchorPosition(box, anchor);

    /**
     * Anchor arrow is a 40 by 20 sprite we scale to 20 by 10.
     */
    let sprite = new Sprite(new Texture(assetService.get("anchor_arrow", "TexturePNG", true)));
    sprite.rotation = anchor.rotation;
    sprite.scale.x = 0.5 / canvasZoom;
    sprite.scale.y = 0.5 / canvasZoom;
    sprite.position.x = position.x;
    sprite.position.y = position.y;
    sprite.pivot.y = 10;
    return sprite;
}

export function getAnchorPosition(box : Box2, anchor : DragAnchor) {
    return {
        x: box.dimension.x * anchor.location.x + box.position.x,
        y: box.dimension.y * anchor.location.y + box.position.y
    };
}

export function anchorContainsPoint(box : Box2, anchor : DragAnchor, point : Vector) {
    let position = getAnchorPosition(box, anchor);
    let relativeLocation = vectorRotate(vectorSubtract(point, position), -anchor.rotation);
    let ySize = anchor.dimension.y / 2;
    return 0 <= relativeLocation.x && relativeLocation.x <= anchor.dimension.x
            && -ySize <= relativeLocation.y && relativeLocation.y <= ySize;
}

export function getResizeFromDrag(box : Box2, anchor : DragAnchor, startPosition : Vector, endPosition : Vector) {
    let xPositionMultiplier = _getPositionMultiplier(anchor.location.x);
    let yPositionMultiplier = _getPositionMultiplier(anchor.location.y);

    let xDimensionMultiplier = _getDimensionMultiplier(anchor.location.x);
    let yDimensionMultiplier = _getDimensionMultiplier(anchor.location.y);

    return {
        ...box,
        position : {
            x: box.position.x + xPositionMultiplier * (endPosition.x - startPosition.x),
            y: box.position.y + yPositionMultiplier * (endPosition.y - startPosition.y)
        },
        dimension : {
            x: box.dimension.x + xDimensionMultiplier * (endPosition.x - startPosition.x),
            y: box.dimension.y + yDimensionMultiplier * (endPosition.y - startPosition.y)
        }
    };
}

function _getPositionMultiplier(anchorLocation : number) {
    if (anchorLocation === 0) {
        return 1;
    } else {
        return 0;
    }
}

function _getDimensionMultiplier(anchorLocation : number) {
    if (anchorLocation === 0) {
        return -1;
    } else if (anchorLocation === 1) {
        return 1;
    } else {
        return 0;
    }
}
