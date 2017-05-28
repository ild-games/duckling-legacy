import {Graphics} from 'pixi.js';

import {drawRectangle, drawX} from '../../canvas/drawing/util';
import {DrawnConstruct, TransformProperties} from '../../canvas/drawing/drawn-construct';
import {Entity} from '../../entitysystem/entity';
import {AssetService} from '../../project';
import {Vector} from '../../math/vector';
import {AttributeDrawer} from '../../canvas/drawing/entity-drawer.service';

import {CollisionAttribute} from './collision-attribute';

const blue = 0x00ccff;

class CollisionDrawnConstruct extends DrawnConstruct {
    dimension : Vector;
    anchor : Vector;

    paint(graphics : Graphics) {
        graphics.lineStyle(1, blue, 1);
        drawRectangle(
            {
                x: this.transformProperties.position.x - (this.dimension.x * this.anchor.x),
                y: this.transformProperties.position.y - (this.dimension.y * this.anchor.y)
            }, 
            this.dimension, 
            graphics);
        drawX(
            {
                x: this.transformProperties.position.x - (this.dimension.x * this.anchor.x),
                y: this.transformProperties.position.y - (this.dimension.y * this.anchor.y)
            }, 
            this.dimension, 
            graphics);
    }
}

export function getCollisionAttributeDrawnConstruct(collisionAttribute : CollisionAttribute, assetService : AssetService) : DrawnConstruct {
    let drawnConstruct = new CollisionDrawnConstruct();
    drawnConstruct.layer = Number.POSITIVE_INFINITY;
    drawnConstruct.dimension = collisionAttribute.dimension.dimension;
    drawnConstruct.anchor = collisionAttribute.anchor;
    return drawnConstruct;
}
