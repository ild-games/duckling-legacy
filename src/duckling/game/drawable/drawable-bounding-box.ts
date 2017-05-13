import {DisplayObject, Container} from 'pixi.js';

import {Entity} from '../../entitysystem/entity';
import {Box2, vectorSubtract} from '../../math';
import {positionToAnchor, anchorToPosition} from '../../math/anchor';
import {AssetService} from '../../project';
import {immutableAssign} from '../../util';
import {DrawnConstruct, drawnConstructBounds} from '../../canvas/drawing/drawn-construct';
import {AttributeBoundingBox} from '../../entitysystem/services/entity-box.service';
import {resize, resizePoint} from '../../entitysystem/services/resize';

import {drawDrawable} from './drawable-drawer';
import {Drawable, DrawableType, cppTypeToDrawableType} from './drawable';
import {DrawableAttribute} from './drawable-attribute';
import {ShapeDrawable} from './shape-drawable';
import {ContainerDrawable} from './container-drawable';
import {ImageDrawable} from './image-drawable';
import {TileBlockDrawable, getTileHeight, getTileWidth} from './tile-block-drawable';
import {AnimatedDrawable} from './animated-drawable';
import {TextDrawable} from './text-drawable';
import {ShapeType, Shape, cppTypeToShapeType} from './shape';
import {Circle} from './circle';
import {Rectangle} from './rectangle';

/**
 * Get the bounding box for an entity with a drawable attribute.
 * @param entity The entity the bounding box will be built for.
 * @return A Box2 bounding box for the entity's drawable attribute.
 */
export const drawableBoundingBox : AttributeBoundingBox<DrawableAttribute> = {
    getBox(drawableAttribute : DrawableAttribute, assetService : AssetService) : Box2 {
        return getDrawableBox(drawableAttribute.topDrawable, assetService);
    },
    setBox(drawableAttribute : DrawableAttribute, resizeToBox: Box2, assetService : AssetService) : DrawableAttribute {
        if (drawableAttribute.topDrawable) {
            return {
                ...drawableAttribute,
                topDrawable : setDrawableBox(drawableAttribute.topDrawable, resizeToBox, assetService)
            }
        } else {
            return drawableAttribute;
        }
    }
};

function getDrawableBox(drawable : Drawable, assetService : AssetService) {
    let construct = drawDrawable(drawable, assetService, true);
    if (construct) {
        return drawnConstructBounds(construct);
    }
    return null;
}

function setDrawableBox(drawable : Drawable, resizeToBox: Box2, assetService : AssetService) : Drawable {
    let updatedDrawable = drawable;
    switch (cppTypeToDrawableType(drawable.__cpp_type)) {
        case DrawableType.Shape:
            return setShapeBox(drawable as ShapeDrawable, resizeToBox, assetService);
        case DrawableType.Container:
            return setContainerBox(drawable as ContainerDrawable, resizeToBox, assetService);
        case DrawableType.Image:
            return setImageBox(drawable as ImageDrawable, resizeToBox, assetService);
        case DrawableType.Animated:
            return setAnimatedBox(drawable as AnimatedDrawable, resizeToBox, assetService);
        case DrawableType.Text:
            return setBoxViaScale(drawable, resizeToBox, assetService);
        case DrawableType.TileBlock:
            return setTileBlockBox(drawable as TileBlockDrawable, resizeToBox, assetService);
    }
    return drawable;
}

function setContainerBox(drawable : ContainerDrawable, resizeToBox: Box2, assetService : AssetService) : ContainerDrawable {
    let currentBox = getDrawableBox(drawable, assetService);
    let currentPosition = anchorToPosition(drawable.anchor, currentBox.dimension);
    let newPosition = resizePoint(currentBox, resizeToBox, currentPosition);

    return {
        ...drawable,
        position : positionToAnchor(newPosition, resizeToBox.dimension),
        drawables : drawable.drawables.map((childDrawable) => {
            let childBox = getDrawableBox(childDrawable, assetService);
            return setDrawableBox(childDrawable, resize(currentBox, resizeToBox, childBox, newPosition), assetService);
        })
    }
}

function setAnimatedBox(drawable : AnimatedDrawable, resizeToBox : Box2, assetService : AssetService) : AnimatedDrawable {
    let currentBox = getDrawableBox(drawable, assetService);
    let currentPosition = anchorToPosition(drawable.anchor, currentBox.dimension);
    let newPosition = resizePoint(currentBox, resizeToBox, currentPosition);
    return {
        ...drawable,
        frames : drawable.frames.map((childDrawable) => {
            let childBox = getDrawableBox(childDrawable, assetService);
            return setDrawableBox(childDrawable, resize(currentBox, resizeToBox, childBox, newPosition), assetService);
        })
    }
}

function setImageBox(drawable : ImageDrawable, resizeToBox: Box2, assetService : AssetService) : ImageDrawable {
    if (drawable.isTiled) {
        return {
            ...drawable,
            anchor : positionToAnchor(resizeToBox.position, resizeToBox.dimension),
            tiledArea: resizeToBox.dimension
        }
    }
    return setBoxViaScale(drawable, resizeToBox, assetService);
}

function setBoxViaScale<T extends Drawable>(drawable : T, resizeToBox : Box2, assetService : AssetService) : T {
    let originalSize = getDrawableBox(drawable, assetService);
    return {
        ...(drawable as any),
        scale : {
            x : resizeToBox.dimension.x / originalSize.dimension.x * drawable.scale.x,
            y : resizeToBox.dimension.y / originalSize.dimension.y * drawable.scale.y,
        },
        anchor : positionToAnchor(resizeToBox.position, resizeToBox.dimension),
    }
}

function setShapeBox(drawable : ShapeDrawable, resizeToBox: Box2, assetService : AssetService) : ShapeDrawable {
    let shape : Shape = drawable.shape;
    switch (cppTypeToShapeType(drawable.shape.__cpp_type)) {
        case ShapeType.Circle:
            return setBoxViaScale(drawable, resizeToBox, assetService);
        case ShapeType.Rectangle:
            let rectangle : Rectangle = {
                ... (shape as Rectangle),
                dimension : resizeToBox.dimension
            }
            return {...drawable, shape : rectangle, anchor : positionToAnchor(resizeToBox.position, resizeToBox.dimension)};
    }
    return drawable;
}

function setTileBlockBox(drawable : TileBlockDrawable, resizeToBox: Box2, assetService : AssetService) : TileBlockDrawable {
    let tileWidth = getTileWidth(drawable, assetService);
    let tileHeight = getTileHeight(drawable, assetService);
    let widthInTiles = resizeToBox.dimension.x / tileWidth;
    let heightInTiles = resizeToBox.dimension.y / tileHeight;
    return {
        ...drawable,
        anchor : positionToAnchor(resizeToBox.position, resizeToBox.dimension),
        size: { 
            x: (widthInTiles < 1) ? tileWidth : resizeToBox.dimension.x,
            y: (heightInTiles < 1) ? tileHeight : resizeToBox.dimension.y
        }
    }
}