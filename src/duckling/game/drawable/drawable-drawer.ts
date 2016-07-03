import {Graphics} from 'pixi.js';

import {getPosition} from '../position/position-attribute';
import {Entity} from '../../entitysystem/entity';
import {Vector} from '../../math';
import {drawEllipse, drawRectangle} from '../../canvas/drawing/util';

import {DrawableAttribute, getDrawableAttribute} from './drawable-attribute';
import {Drawable, DrawableType} from './drawable';
import {ShapeDrawable} from './shape-drawable';
import {ShapeType, Shape} from './shape';
import {Circle} from './circle';
import {Rectangle} from './rectangle';

export function drawDrawableAttribute(entity : Entity) {
    var positionAttribute = getPosition(entity);
    if (!positionAttribute) {
        return null;
    }

    return drawDrawable(getDrawableAttribute(entity).topDrawable, positionAttribute.position);
}

function drawDrawable(drawable : Drawable, position : Vector) {
    if (!drawable) {
        return null;
    }

    switch (drawable.type) {
        case DrawableType.Shape:
            return drawShapeDrawable((drawable as ShapeDrawable).shape, position);
        default:
            return null;
    }
}

function drawShapeDrawable(shape : Shape, position : Vector) {
    var graphics = new Graphics();
    graphics.beginFill(0x000000, 1)
    switch (shape.type) {
        case ShapeType.Circle:
            var radius = (shape as Circle).radius;
            drawEllipse(position, radius, radius, graphics);
            break;
        case ShapeType.Rectangle:
            var dimension = (shape as Rectangle).dimension;
            drawRectangle(position, dimension, graphics);
            break;
    }
    graphics.endFill();
    return graphics;
}
