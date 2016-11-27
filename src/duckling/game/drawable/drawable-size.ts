import {Vector, vectorDivide, vectorMultiply, vectorAbsolute, vectorSign, vectorToFixed} from '../../math/vector';
import {immutableAssign} from '../../util/model';
import {Entity} from '../../entitysystem/entity';
import {AssetService} from '../../project/asset.service';

import {DrawableAttribute, getDrawableAttribute} from './drawable-attribute';
import {drawableBoundingBox} from './drawable-bounding-box';

export function setDrawableSize(entity : Entity, newSize : Vector, fixedNum : number, assetService : AssetService) : DrawableAttribute {
    let drawableAttribute = getDrawableAttribute(entity);
    if (!drawableAttribute.topDrawable) {
        return drawableAttribute;
    }

    let scaleSign = vectorSign(drawableAttribute.topDrawable.scale);
    let oldScale = vectorAbsolute(drawableAttribute.topDrawable.scale);
    let oldSize = vectorAbsolute(getDrawableSize(entity, assetService));
    let newScale = vectorToFixed(vectorDivide(vectorMultiply(oldScale, newSize), oldSize), fixedNum);
    if (_isValidScale(newScale)) {
        let newTopDrawable = immutableAssign(drawableAttribute.topDrawable, {scale: newScale});
        return immutableAssign(drawableAttribute, {topDrawable: newTopDrawable});
    }
    return drawableAttribute;
}

export function getDrawableSize(entity : Entity, assetService : AssetService) : Vector {
    let boundingBox = drawableBoundingBox(entity, assetService);
    if (boundingBox) {
        return boundingBox.dimension;
    }
    return {x: 0, y: 0};
}

function _isValidScale(scale : Vector) : boolean {
    return (
        !isNaN(scale.x) && !isNaN(scale.y) &&
        isFinite(scale.x) && isFinite(scale.y) &&
        scale.x !== 0  && scale.y !== 0
    );
}
