import {DrawableAttribute} from './drawable-attribute.ts';
import {Vector} from '../../math';
import {immutableAssign} from '../../util';

/**
 * Will be registered with the EntityPositionSetService.
 */
export function getLayer(attribute : DrawableAttribute) : Number {
    return attribute.topDrawable.renderPriority;
}
