import {Graphics} from 'pixi.js';

import {drawRectangle, drawX} from '../../canvas/drawing/util';
import {DrawnConstruct, TransformProperties} from '../../canvas/drawing/drawn-construct';
import {Entity} from '../../entitysystem/entity';
import {AssetService} from '../../project';
import {Vector} from '../../math/vector';
import {AttributeDrawer} from '../../canvas/drawing/entity-drawer.service';

import {CollisionAttribute} from './collision-attribute';

const blue = 0x00ccff;

export function getCollisionAttributeDrawnConstruct(collisionAttribute : CollisionAttribute, assetService : AssetService) : DrawnConstruct {
    let drawnConstruct = new DrawnConstruct();
    drawnConstruct.layer = Number.POSITIVE_INFINITY;
    drawnConstruct.painter = (graphics : Graphics, transformProperties : TransformProperties) => {
        graphics.lineStyle(1, blue, 1);
        drawRectangle(
            {
                x: transformProperties.position.x - (collisionAttribute.dimension.dimension.x * collisionAttribute.anchor.x),
                y: transformProperties.position.y - (collisionAttribute.dimension.dimension.y * collisionAttribute.anchor.y)
            }, 
            collisionAttribute.dimension.dimension, 
            graphics);
        drawX(
            {
                x: transformProperties.position.x - (collisionAttribute.dimension.dimension.x * collisionAttribute.anchor.x),
                y: transformProperties.position.y - (collisionAttribute.dimension.dimension.y * collisionAttribute.anchor.y)
            }, 
            collisionAttribute.dimension.dimension, 
            graphics);
    };
    return drawnConstruct;
}
