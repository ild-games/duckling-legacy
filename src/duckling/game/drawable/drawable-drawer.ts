import {Graphics} from 'pixi.js';

import {getPosition} from '../position/position-attribute';
import {Entity} from '../../entitysystem/entity';
import {Vector, degreesToRadians} from '../../math';
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

    var graphics = new Graphics();
    applyDrawableProperties(drawable, position, graphics);
    switch (drawable.type) {
        case DrawableType.Shape:
            return drawShapeDrawable((drawable as ShapeDrawable).shape, drawable.color, graphics);
        default:
            return null;
    }
}

function drawShapeDrawable(shape : Shape, color : string, graphics : Graphics) {
    graphics.beginFill(parseInt(color, 16), 1);
    switch (shape.type) {
        case ShapeType.Circle:
            var radius = (shape as Circle).radius;
            drawEllipse({x: 0, y: 0}, radius, radius, graphics);
            break;
        case ShapeType.Rectangle:
            var dimension = (shape as Rectangle).dimension;
            drawRectangle({x: 0, y: 0}, dimension, graphics);
            break;
    }
    graphics.endFill();
    return graphics;
}

function applyDrawableProperties(drawable : Drawable, position : Vector, graphics : Graphics) {
    graphics.position.x = position.x;
    graphics.position.y = position.y;
    graphics.scale.x = drawable.scale.x;
    graphics.scale.y = drawable.scale.y;
    graphics.rotation = degreesToRadians(drawable.rotation);
}
