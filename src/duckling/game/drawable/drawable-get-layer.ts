import {DrawableAttribute} from './drawable-attribute';
import {Vector} from '../../math';
import {immutableAssign} from '../../util';

/**
 * Will be registered with the EntityLayerService.
 */
export function getDrawableLayer(attribute : DrawableAttribute) : string {
    return "" + attribute.topDrawable.renderPriority;
}
