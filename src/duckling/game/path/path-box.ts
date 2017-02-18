import {Entity} from '../../entitysystem/entity';
import {Box2, EMPTY_BOX} from '../../math/box2';
import {AssetService} from '../../project/asset.service';
import {immutableAssign} from '../../util/model';
import {drawnConstructBounds} from '../../canvas/drawing/drawn-construct';

import {PATH_HEIGHT, drawPathAttribute} from './path-drawer';
import {getPath} from './path-attribute';

export function pathBox(entity : Entity) : Box2 {
    let boxDrawnConstruct = drawPathAttribute(entity);
    if (!boxDrawnConstruct) {
        return null;
    }
    
    let bounds : Box2 = drawnConstructBounds(boxDrawnConstruct);
    if (!bounds) {
        return null;
    }
    return bounds;
}