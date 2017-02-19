import {Attribute, Entity} from '../../entitysystem/entity';
import {Vector} from '../../math/vector';

export const PATH_KEY = "Path";

export interface PathAttribute extends Attribute {
    vertices: Vector[],
    isLoop: boolean
}

export let defaultPath : PathAttribute = {
    vertices: [{x: 0, y: 0}, {x: 250, y: 0}],
    isLoop: false
}

export function getPath(entity : Entity) : PathAttribute {
    return <PathAttribute>entity[PATH_KEY];
}