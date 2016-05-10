import {Graphics} from 'pixi.js';

import {Entity} from '../../entitysystem/entity';
import {getPosition} from '../position/position-attribute';
import {getCollision} from './collision-attribute';
import {drawRectangle, drawX} from '../../canvas/drawing/util';

const blue = 0x00ccff;

/**
 * Used to draw a collision component.
 * @param  entity The entity the component belongs to.
 * @return A DisplayObject representing the collision component.
 */
export function drawCollision(entity : Entity) {
    var graphics = new Graphics();
    var positionAttribute = getPosition(entity);
    var collisionAttribute = getCollision(entity);

    graphics.lineStyle(2, blue, 1);
    drawRectangle(positionAttribute.position, collisionAttribute.dimension.dimension, graphics);
    drawX(positionAttribute.position, collisionAttribute.dimension.dimension, graphics);

    return graphics;
}
