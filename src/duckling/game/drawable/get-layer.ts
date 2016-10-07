import {DrawableAttribute} from './drawable-attribute';
import {Vector} from '../../math';
import {immutableAssign} from '../../util';

/**
 * Will be registered with the EntityLayerService.
 */
export function getLayer(attribute : DrawableAttribute) : Number {
    return attribute.topDrawable.renderPriority;
}
