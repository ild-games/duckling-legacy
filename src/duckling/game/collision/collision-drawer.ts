import {Graphics} from 'pixi.js';

import {drawRectangle, drawX} from '../../canvas/drawing/util';
import {DrawnConstruct, createPainterConstruct} from '../../canvas/drawing';
import {Entity} from '../../entitysystem/entity';
import {AssetService} from '../../project';
import {Vector} from '../../math/vector';
import {AttributeDrawer} from '../../canvas/drawing/entity-drawer.service';

import {CollisionAttribute} from './collision-attribute';

const blue = 0x00ccff;

export function getCollisionAttributeDrawnConstruct(collisionAttribute : CollisionAttribute, assetService : AssetService) : DrawnConstruct {
    return createPainterConstruct((position: Vector, graphics : Graphics) => {
        graphics.lineStyle(1, blue, 1);
        drawRectangle(
            {
                x: position.x - (collisionAttribute.dimension.dimension.x * collisionAttribute.anchor.x),
                y: position.y - (collisionAttribute.dimension.dimension.y * collisionAttribute.anchor.y)
            }, 
            collisionAttribute.dimension.dimension, 
            graphics);
        drawX(
            {
                x: position.x - (collisionAttribute.dimension.dimension.x * collisionAttribute.anchor.x),
                y: position.y - (collisionAttribute.dimension.dimension.y * collisionAttribute.anchor.y)
            }, 
            collisionAttribute.dimension.dimension, 
            graphics);
    });
}
