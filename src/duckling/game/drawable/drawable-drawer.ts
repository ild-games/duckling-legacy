import {ReflectiveInjector} from '@angular/core';

import {Texture, Sprite, Graphics, DisplayObject, Container} from 'pixi.js';
import * as PIXI from 'pixi.js';

import {AssetService} from '../../project';
import {Entity} from '../../entitysystem/entity';
import {Vector, degreesToRadians} from '../../math';
import {drawMissingAsset} from '../../canvas/drawing/util';
import {
    colorToHex,
    drawEllipse,
    drawRectangle,
    AnimationConstruct,
    DrawnConstruct,
    isAnimationConstruct,
    isContainerContruct,
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
 * @param  entity The entity with the drawable attribute
 * @return DisplayObject that contains the drawn DrawableAttribute
 */
export function drawDrawableAttribute(entity : Entity, assetService : AssetService) : DrawnConstruct {
    let drawableAttribute = getDrawableAttribute(entity);
    if (!drawableAttribute.topDrawable) {
        return null;
    }

    let drawable : DrawnConstruct;
    drawable = _drawDrawable(drawableAttribute.topDrawable, assetService);
    if (!drawable) {
        return null;
    }
    _setNonInteractive(drawable);

    return drawable;
}

function _drawDrawable(drawable : Drawable, assetService : AssetService) : DrawnConstruct {
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

function _drawShapeDrawable(shapeDrawable : ShapeDrawable) : DisplayObject {
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
            childConstructs: []
        };
    }

    let childConstructs : DrawnConstruct[] = []
    for (let drawable of containerDrawable.drawables) {
        let childDrawable = _drawDrawable(drawable, assetService);
        if (childDrawable) {
            childConstructs = childConstructs.concat(_drawDrawable(drawable, assetService));
        }
    }
    return {
        type: "CONTAINER",
        childConstructs: childConstructs
    };
}

function _drawAnimatedDrawable(animatedDrawable : AnimatedDrawable, assetService : AssetService) : AnimationConstruct {
    if (!animatedDrawable.frames || animatedDrawable.frames.length === 0) {
        return {
            type: "ANIMATION",
            duration: 0,
            frames: []
        }
    }

    let framesDisplayObjects : DrawnConstruct[] = [];
    for (let frame of animatedDrawable.frames) {
        let frameDrawable = _drawDrawable(frame, assetService);
        if (frameDrawable) {
            framesDisplayObjects.push(_drawDrawable(frame, assetService));
        }
    }

    return {
        type: "ANIMATION",
        duration: animatedDrawable.duration,
        frames: framesDisplayObjects
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
    let sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 0.5);
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
    text.anchor.set(0.5, 0.5);
    return text;
}

function _isPartialImageValidForTexture(imageDrawable : ImageDrawable, texture : Texture) {
    return (
        imageDrawable.textureRect.position.x + imageDrawable.textureRect.dimension.x <= texture.frame.width &&
        imageDrawable.textureRect.position.y + imageDrawable.textureRect.dimension.y <= texture.frame.height
    );
}


function _applyDrawableProperties(drawable : Drawable, drawableDisplayObject : DrawnConstruct) {
    function _applyDisplayObjectProperties(displayObject : DisplayObject) {
        displayObject.scale.x *= drawable.scale.x;
        displayObject.scale.y *= drawable.scale.y;
        displayObject.rotation += degreesToRadians(drawable.rotation);
        displayObject.position.x += drawable.positionOffset.x;
        displayObject.position.y += drawable.positionOffset.y;
    }
    if (!drawableDisplayObject) {
        return;
    }

    if (isAnimationConstruct(drawableDisplayObject)) {
        for (let frame of drawableDisplayObject.frames) {
            _applyDrawableProperties(drawable, frame);
        }
    } else if (isContainerContruct(drawableDisplayObject)) {
        for (let child of drawableDisplayObject.childConstructs) {
            _applyDrawableProperties(drawable, child);
        }
    } else if (isDisplayObject(drawableDisplayObject)) {
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
    } else if (isContainerContruct(drawable)) {
        for (let child of drawable.childConstructs) {
            _setNonInteractive(child);
        }
    } else if (isDisplayObject(drawable)) {
        drawable.interactiveChildren = false;
    } else {
        throw Error("Unknown DrawnConstruct type in drawable-drawer::_setNonInteractive");
    }
}
