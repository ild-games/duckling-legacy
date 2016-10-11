import {DrawableAttribute} from './drawable-attribute';
import {Box2, Vector, vectorAdd, vectorSubtract, vectorAbsolute, vectorMultiply, vectorDivide} from '../../math';
import {immutableAssign} from '../../util';

export function resizeDrawable(attribute : DrawableAttribute, lastCoords : Vector, curCoords : Vector, position : Vector) : DrawableAttribute {
    let lastDimension = vectorSubtract(lastCoords, position);
    let newDimension = vectorSubtract(curCoords, position);
    let oldScale = attribute.topDrawable.scale;
    let newScale = vectorDivide(vectorMultiply(newDimension, oldScale), lastDimension);
    if (_isValidScale(newScale)) {
        let newTopDrawable = immutableAssign(attribute.topDrawable, {scale: newScale});
        return immutableAssign(attribute, {topDrawable: newTopDrawable});
    }
    return attribute;
}

function _isValidScale(scale : Vector) : boolean {
    return (
        !isNaN(scale.x) && !isNaN(scale.y) &&
        isFinite(scale.x) && isFinite(scale.y) &&
        scale.x !== 0  && scale.y !== 0
    );
}
