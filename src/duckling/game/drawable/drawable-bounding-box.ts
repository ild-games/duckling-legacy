import {DisplayObject, Container} from 'pixi.js';

import {Entity} from '../../entitysystem/entity';
import {Box2} from '../../math';
import {AssetService} from '../../project';
import {immutableAssign} from '../../util';
import {DrawnConstruct, drawnConstructBounds} from '../../canvas/drawing/drawn-construct';

import {drawDrawableAttribute} from './drawable-drawer';

/**
 * Get the bounding box for an entity with a drawable attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's drawable attribute.
 */
export function drawableBoundingBox(entity : Entity, assetService : AssetService) : Box2 {
    let entityDrawnConstruct = drawDrawableAttribute(entity, assetService);
    if (!entityDrawnConstruct) {
        return null;
    }

    let bounds : Box2 = drawnConstructBounds(entityDrawnConstruct);
    if (!bounds) {
        return null;
    }
    return bounds;
}
