import {Entity} from '../../entitysystem/entity';
import {Box2, EMPTY_BOX} from '../../math/box2';
import {Vector} from '../../math/vector';
import {AssetService} from '../../project/asset.service';
import {immutableAssign} from '../../util/model';
import {drawnConstructBounds} from '../../canvas/drawing/drawn-construct';

import {PATH_HEIGHT, drawPathAttribute} from './path-drawer';
import {getPath} from './path-attribute';

const PADDING = 5;

export function pathBox(entity : Entity) : Box2 {
    let path = getPath(entity);
    if (!path.vertices || path.vertices.length === 0) {
        return null;
    }

    if (path.vertices.length === 1) {
        return {
            position: {x: path.vertices[0].x - PADDING, y: path.vertices[1].y - PADDING},
            dimension: {x: PADDING * 2, y: PADDING * 2},
            rotation: 0
        };
    }
    
    let {min, max} = getMinAndMaxVertices(path.vertices);
    return {
        position: {x: min.x - PADDING, y: min.y - PADDING},
        dimension: {x: max.x - min.x + PADDING * 2, y: max.y - min.y + PADDING * 2},
        rotation: 0
    };
}

function getMinAndMaxVertices(vertices : Vector[]) : {min: Vector, max: Vector} {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let vertex of vertices) {
        minX = Math.min(minX, vertex.x);
        maxX = Math.max(maxX, vertex.x);
        minY = Math.min(minY, vertex.y);
        maxY = Math.max(maxY, vertex.y);
    }
    return {
        min: {x: minX, y: minY},
        max: {x: maxX, y: maxY}
    };
}