import {Vector, vectorDivide, vectorMultiply, vectorAbsolute, vectorSign, vectorToString} from '../../math/vector';
import {immutableAssign} from '../../util/model';
import {Entity} from '../../entitysystem/entity';
import {AssetService} from '../../project/asset.service';

import {DrawableAttribute, getDrawableAttribute} from './drawable-attribute';
import {drawableBoundingBox} from './drawable-bounding-box';

export function setDrawableSize(entity : Entity, newSize : Vector, assetService : AssetService) : DrawableAttribute {
    let drawableAttribute = getDrawableAttribute(entity);
    let scaleSign = vectorSign(drawableAttribute.topDrawable.scale);
    let oldScale = vectorAbsolute(drawableAttribute.topDrawable.scale);
    let oldSize = vectorAbsolute(getDrawableSize(entity, assetService));
    let newScale = vectorDivide(vectorMultiply(oldScale, newSize), oldSize);
    if (_isValidScale(newScale)) {
        let newTopDrawable = immutableAssign(drawableAttribute.topDrawable, {scale: newScale});
        return immutableAssign(drawableAttribute, {topDrawable: newTopDrawable});
    }
    return drawableAttribute;
}

export function getDrawableSize(entity : Entity, assetService : AssetService) : Vector {
    return drawableBoundingBox(entity, assetService).dimension;
}

function _isValidScale(scale : Vector) : boolean {
    return (
        !isNaN(scale.x) && !isNaN(scale.y) &&
        isFinite(scale.x) && isFinite(scale.y) &&
        scale.x !== 0  && scale.y !== 0
    );
}
