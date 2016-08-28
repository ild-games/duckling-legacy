import {Graphics} from 'pixi.js';

import {drawRectangle, drawX} from '../../canvas/drawing/util';
import {DrawnConstruct} from '../../canvas/drawing';
import {Entity} from '../../entitysystem/entity';
import {getPosition} from '../position/position-attribute';
import {AssetService} from '../../project';

import {getCollision} from './collision-attribute';


const blue = 0x00ccff;

/**
 * Used to draw a collision component.
 * @param  entity The entity the component belongs to.
 * @return A DisplayObject representing the collision component.
 */
export function drawCollision(entity : Entity) : DrawnConstruct {
    let positionAttribute = getPosition(entity);
    let collisionAttribute = getCollision(entity);

    if (!positionAttribute || !collisionAttribute) {
        return null;
    }

    let graphics = new Graphics();
    graphics.lineStyle(1, blue, 1);
    drawRectangle(positionAttribute.position, collisionAttribute.dimension.dimension, graphics);
    drawX(positionAttribute.position, collisionAttribute.dimension.dimension, graphics);

    return graphics;
}
