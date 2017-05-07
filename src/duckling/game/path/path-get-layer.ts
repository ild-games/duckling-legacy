import {PathAttribute} from './path-attribute';
import {Vector} from '../../math';
import {immutableAssign} from '../../util';

/**
 * Will be registered with the EntityLayerService.
 */
export function getPathLayer(attribute : PathAttribute) : string {
    return "path-gizmos";
}
