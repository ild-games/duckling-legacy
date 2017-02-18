import {Attribute, Entity} from '../../entitysystem/entity';
import {Vector} from '../../math/vector';

export const PATH_KEY = "Path";

export interface PathAttribute extends Attribute {
    startVertex: Vector,
    endVertex: Vector
}

export let defaultPath : PathAttribute = {
    startVertex: {x: 0, y: 0},
    endVertex: {x: 250, y: 0},
}

export function getPath(entity : Entity) : PathAttribute {
    return <PathAttribute>entity[PATH_KEY];
}