import {Graphics} from 'pixi.js';

import {drawRectangle, drawX} from '../../canvas/drawing/util';
import {DrawnConstruct} from '../../canvas/drawing';
import {Entity} from '../../entitysystem/entity';
import {AssetService} from '../../project';

import {getCollision} from './collision-attribute';

const blue = 0x00ccff;

/**
 * Used to draw a collision component.
 * @param  entity The entity the component belongs to.
 * @return A DisplayObject representing the collision component.
 */
export function drawCollision(entity : Entity) : DrawnConstruct {
    let collisionAttribute = getCollision(entity);

    if (!collisionAttribute) {
        return null;
    }

    let graphics = new Graphics();
    graphics.lineStyle(1, blue, 1);
    drawRectangle({x: 0, y: 0}, collisionAttribute.dimension.dimension, graphics);
    drawX({x: 0, y: 0}, collisionAttribute.dimension.dimension, graphics);
    graphics.pivot.x = (collisionAttribute.dimension.dimension.x * collisionAttribute.anchor.x);
    graphics.pivot.y = (collisionAttribute.dimension.dimension.y * collisionAttribute.anchor.y);

    return graphics;
}
