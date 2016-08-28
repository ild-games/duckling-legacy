import {Entity} from '../../entitysystem/entity';
import {Asset, AssetMap} from '../../project';

import {DrawableAttribute, getDrawableAttribute} from './drawable-attribute';
import {Drawable, DrawableType, cppTypeToDrawableType} from './drawable';
import {ImageDrawable} from './image-drawable';
import {ContainerDrawable} from './container-drawable';
import {AnimatedDrawable} from './animated-drawable';

/**
 * Gets the required assets for a given entity's DrawableAttribute
 * @param  entity Entity to get the assets for
 * @return Map of asset keys to Assets for the given entity's DrawableAttribute
 */
export function entityRequiredDrawableAssets(entity : Entity) : AssetMap {
    let drawableAttribute = getDrawableAttribute(entity);
    if (!drawableAttribute.topDrawable) {
        return {};
    }

    return drawableRequiredAssets(drawableAttribute.topDrawable);
}

function drawableRequiredAssets(drawable : Drawable) : AssetMap {
    switch (cppTypeToDrawableType(drawable.__cpp_type)) {
        case DrawableType.Image:
            return imageDrawableRequiredAssets(drawable as ImageDrawable);
        case DrawableType.Container:
            return containerDrawableRequiredAssets(drawable as ContainerDrawable);
        case DrawableType.Animated:
            return animatedDrawableRequiredAssets(drawable as AnimatedDrawable);
    }
    return {};
}

function imageDrawableRequiredAssets(imageDrawable : ImageDrawable) : AssetMap {
    let assets : AssetMap = {};
    if (!imageDrawable.textureKey) {
        return assets;
    }
    
    assets[imageDrawable.textureKey] = {
        type: "TexturePNG",
        key: imageDrawable.textureKey
    };
    return assets;
}

function containerDrawableRequiredAssets(containerDrawable : ContainerDrawable) : AssetMap {
    let assets : AssetMap = {};
    for (let drawable of containerDrawable.drawables) {
        assets = Object.assign(assets, drawableRequiredAssets(drawable));
    }
    return assets;
}

function animatedDrawableRequiredAssets(animatedDrawable : AnimatedDrawable) : AssetMap {
    let assets : AssetMap = {};
    for (let drawable of animatedDrawable.frames) {
        assets = Object.assign(assets, drawableRequiredAssets(drawable));
    }
    return assets;
}
