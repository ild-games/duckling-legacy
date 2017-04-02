import {ReflectiveInjector} from '@angular/core';

import {RenderTexture, Texture, Sprite, Graphics, DisplayObject, Container} from 'pixi.js';
import * as PIXI from 'pixi.js';

import {AssetService} from '../../project';
import {Entity} from '../../entitysystem/entity';
import {Vector, degreesToRadians} from '../../math';
import {Box2} from '../../math/box2';
import {immutableAssign} from '../../util/model';
import {drawMissingAsset} from '../../canvas/drawing/util';
import {drawnConstructBounds} from '../../canvas/drawing/drawn-construct';
import {
    colorToHex,
    drawEllipse,
    drawRectangle,
    AnimationConstruct,
    DrawnConstruct,
    isDrawnConstruct,
    isAnimationConstruct,
    isContainerConstruct,
    isDisplayObject,
    ContainerConstruct
} from '../../canvas/drawing';

import {DrawableAttribute, getDrawableAttribute} from './drawable-attribute';
import {Drawable, DrawableType, cppTypeToDrawableType} from './drawable';
import {ShapeDrawable} from './shape-drawable';
import {ContainerDrawable} from './container-drawable';
import {ImageDrawable} from './image-drawable';
import {AnimatedDrawable} from './animated-drawable';
import {TextDrawable} from './text-drawable';
import {ShapeType, Shape, cppTypeToShapeType} from './shape';
import {Circle} from './circle';
import {Rectangle} from './rectangle';

/**
 * Draws the drawable and bounds of the drawable for a DrawableAttribute
 * @param  attribute The drawable attribute
 * @param  assetService Service containing the assets needed to render the drawable attribute.
 * @return DisplayObject that contains the drawn DrawableAttribute
 */
export function drawDrawableAttribute(drawableAttribute : DrawableAttribute, assetService : AssetService) : DrawnConstruct {
    if (!drawableAttribute.topDrawable) {
        return null;
    }

    let drawable : DrawnConstruct;
    drawable = drawDrawable(drawableAttribute.topDrawable, assetService);
    if (!drawable) {
        return null;
    }
    _setNonInteractive(drawable);

    return drawable;
}

/**
 * Draws the drawable and bounds of the drawable for a Drawable.
 * @param  entity The entity with the drawable attribute
 * @param  assetService Service containing the assets needed to render the drawable attribute.
 * @return DisplayObject that contains the drawn DrawableAttribute
 */
export function drawDrawable(drawable : Drawable, assetService : AssetService) : DrawnConstruct {
    if (drawable.inactive) {
        return null;
    }

    let drawnObject : DrawnConstruct;
    let drawableType = cppTypeToDrawableType(drawable.__cpp_type);
    switch (drawableType) {
        case DrawableType.Shape:
            drawnObject = _drawShapeDrawable(drawable as ShapeDrawable);
            break;
        case DrawableType.Container:
            drawnObject = _drawContainerDrawable(drawable as ContainerDrawable, assetService);
            break;
        case DrawableType.Image:
            drawnObject = _drawImageDrawable(drawable as ImageDrawable, assetService);
            break;
        case DrawableType.Animated:
            drawnObject = _drawAnimatedDrawable(drawable as AnimatedDrawable, assetService);
            break;
        case DrawableType.Text:
            drawnObject = _drawTextDrawable(drawable as TextDrawable, assetService);
            break;
        default:
            drawnObject = null;
            break;
    }

    if (drawnObject) {
        _applyDrawableProperties(drawable, drawnObject);
    }
    return drawnObject;
}

function _drawShapeDrawable(shapeDrawable : ShapeDrawable) : Graphics {
    let graphics = new Graphics();
    let colorHex = colorToHex(shapeDrawable.shape.fillColor);
    graphics.beginFill(parseInt(colorHex, 16), 1);
    graphics.fillAlpha = shapeDrawable.shape.fillColor.a / 255;
    let shapeType = cppTypeToShapeType(shapeDrawable.shape.__cpp_type)
    switch (shapeType) {
        case ShapeType.Circle:
            let radius = (shapeDrawable.shape as Circle).radius;
            drawEllipse({x: 0, y: 0}, radius, radius, graphics);
            break;
        case ShapeType.Rectangle:
            let dimension = (shapeDrawable.shape as Rectangle).dimension;
            drawRectangle({x: 0, y: 0}, dimension, graphics);
            break;
    }
    graphics.endFill();
    return graphics;
}

function _drawContainerDrawable(containerDrawable : ContainerDrawable, assetService : AssetService) : ContainerConstruct {
    if (!containerDrawable.drawables || containerDrawable.drawables.length === 0) {
        return {
            type: "CONTAINER",
            childConstructs: [],
            position: {x: 0, y: 0},
            anchor: {x: 0, y: 0},
            rotation: 0,
            scale: {x: 0, y: 0}
        };
    }

    let childConstructs : DrawnConstruct[] = []
    for (let drawable of containerDrawable.drawables) {
        let childDrawable = drawDrawable(drawable, assetService);
        if (childDrawable) {
            childConstructs = childConstructs.concat(drawDrawable(drawable, assetService));
        }
    }
    return {
        type: "CONTAINER",
        childConstructs: childConstructs,
        position: {x: 0, y: 0},
        anchor: {x: 0, y: 0},
        rotation: 0,
        scale: {x: 0, y: 0}
    };
}

function _drawAnimatedDrawable(animatedDrawable : AnimatedDrawable, assetService : AssetService) : AnimationConstruct {
    if (!animatedDrawable.frames || animatedDrawable.frames.length === 0) {
        return {
            type: "ANIMATION",
            duration: 0,
            frames: [],
            position: {x: 0, y: 0},
            anchor: {x: 0, y: 0},
            rotation: 0,
            scale: {x: 0, y: 0}
        }
    }

    let framesDisplayObjects : DrawnConstruct[] = [];
    for (let frame of animatedDrawable.frames) {
        let frameDrawable = drawDrawable(frame, assetService);
        if (frameDrawable) {
            framesDisplayObjects.push(drawDrawable(frame, assetService));
        }
    }

    return {
        type: "ANIMATION",
        duration: animatedDrawable.duration,
        frames: framesDisplayObjects,
        position: {x: 0, y: 0},
        anchor: {x: 0, y: 0},
        rotation: 0,
        scale: {x: 0, y: 0}
    }
}

function _drawImageDrawable(imageDrawable : ImageDrawable, assetService : AssetService) : DisplayObject {
    if (!imageDrawable.textureKey) {
        return null;
    }

    let baseTexture = assetService.get(imageDrawable.textureKey, "TexturePNG");
    if (!baseTexture) {
        return null;
    }
    let texture : Texture;
    if (imageDrawable.isWholeImage) {
        texture = new Texture(baseTexture);
    } else {
        if (_isPartialImageValidForTexture(imageDrawable, baseTexture)) {
            texture = new Texture(baseTexture, new PIXI.Rectangle(
                imageDrawable.textureRect.position.x,
                imageDrawable.textureRect.position.y,
                imageDrawable.textureRect.dimension.x,
                imageDrawable.textureRect.dimension.y));
        } else {
            return drawMissingAsset(assetService);
        }
    }

    let sprite : any;
    if (imageDrawable.isTiled && imageDrawable.tiledArea) {
        sprite = new PIXI.extras.TilingSprite(texture, imageDrawable.tiledArea.x, imageDrawable.tiledArea.y);
    } else {
        sprite = new Sprite(texture);
    }
    let container = new Container();
    container.addChild(sprite);
    return container;
}

function _drawTextDrawable(textDrawable : TextDrawable, assetService : AssetService) : DisplayObject {
    let fontKey = textDrawable.text.fontKey || "Arial";
    let colorHex = "#" + colorToHex(textDrawable.text.color);
    let text = new PIXI.Text(
        textDrawable.text.text,
        {
            fontFamily: assetService.fontFamilyFromAssetKey(fontKey),
            fontSize: textDrawable.text.characterSize,
            fill: colorHex
        } as PIXI.TextStyle);
    return text;
}

function _isPartialImageValidForTexture(imageDrawable : ImageDrawable, texture : Texture) {
    return (
        imageDrawable.textureRect.position.x + imageDrawable.textureRect.dimension.x <= texture.frame.width &&
        imageDrawable.textureRect.position.y + imageDrawable.textureRect.dimension.y <= texture.frame.height
    );
}

function _getBaselineBounds(drawnConstruct : DrawnConstruct) : Box2 {
    drawnConstruct.scale = {x: 1, y: 1};
    return drawnConstructBounds(drawnConstruct);
}

function _applyDrawableProperties(drawable : Drawable, drawableDisplayObject : DrawnConstruct) {
    function _applyDisplayObjectProperties(drawnConstruct : DrawnConstruct) {
        let bounds = _getBaselineBounds(drawnConstruct);
        drawnConstruct.rotation = degreesToRadians(drawable.rotation);
        drawnConstruct.scale.x = drawable.scale.x;
        drawnConstruct.scale.y = drawable.scale.y;
        if (isDisplayObject(drawnConstruct)) {
            drawnConstruct.pivot.x = bounds.dimension.x * drawable.anchor.x;
            drawnConstruct.pivot.y = bounds.dimension.y * drawable.anchor.y;
        } else {
            drawnConstruct.anchor.x = bounds.dimension.x * drawable.anchor.x;
            drawnConstruct.anchor.y = bounds.dimension.y * drawable.anchor.y;
        }
    }
    if (!drawableDisplayObject) {
        return;
    }

    if (isDrawnConstruct(drawableDisplayObject)) {
        _applyDisplayObjectProperties(drawableDisplayObject);
    } else {
        throw Error("Unknown DrawnConstruct type in drawable-drawer::_applyDrawableProperties");
    }
}

/**
 * pixi.js considers Container's children to be interactive (clickable, draggable, etc. via
 * pixi operations). Since we handle the interactive operations, we need to set the children as
 * non-interactive so pixi doesn't throw benign js errors all the time.
 * @param  drawableDrawnConstruct to make non-interactive
 */
function _setNonInteractive(drawable : DrawnConstruct) {
    if (!drawable) {
        return;
    }

    if (isAnimationConstruct(drawable)) {
        for (let frame of drawable.frames) {
            _setNonInteractive(frame);
        }
    } else if (isContainerConstruct(drawable)) {
        for (let child of drawable.childConstructs) {
            _setNonInteractive(child);
        }
    } else if (isDisplayObject(drawable)) {
        drawable.interactiveChildren = false;
    } else {
        throw Error("Unknown DrawnConstruct type in drawable-drawer::_setNonInteractive");
    }
}
