import {ReflectiveInjector} from '@angular/core';

import {Texture, Sprite, Graphics, DisplayObject, Container} from 'pixi.js';
import * as PIXI from 'pixi.js';

import {AssetService} from '../../project';
import {getPosition} from '../position/position-attribute';
import {Entity} from '../../entitysystem/entity';
import {Vector, degreesToRadians} from '../../math';
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
import {ShapeType, Shape, cppTypeToShapeType} from './shape';
import {Circle} from './circle';
import {Rectangle} from './rectangle';

/**
 * Draws the drawable and bounds of the drawable for a DrawableAttribute
 * @param  entity The entity with the drawable attribute
 * @return DisplayObject that contains the drawn DrawableAttribute
 */
export function drawDrawableAttribute(entity : Entity, assetService : AssetService) : DrawnConstruct {
    let positionAttribute = getPosition(entity);
    let drawableAttribute = getDrawableAttribute(entity);
    if (!positionAttribute || !drawableAttribute.topDrawable) {
        return null;
    }

    let drawable = drawDrawable(drawableAttribute.topDrawable, assetService);
    if (!drawable) {
        return null;
    }
    setNonInteractive(drawable);
    setPosition(drawable, positionAttribute.position);

    return drawable;
}

function drawDrawable(drawable : Drawable, assetService : AssetService) : DrawnConstruct {
    if (drawable.inactive) {
        return null;
    }

    let drawnObject : DrawnConstruct;
    let drawableType = cppTypeToDrawableType(drawable.__cpp_type);
    switch (drawableType) {
        case DrawableType.Shape:
            drawnObject = drawShapeDrawable(drawable as ShapeDrawable);
            break;
        case DrawableType.Container:
            drawnObject = drawContainerDrawable(drawable as ContainerDrawable, assetService);
            break;
        case DrawableType.Image:
            drawnObject = drawImageDrawable(drawable as ImageDrawable, assetService);
            break;
        case DrawableType.Animated:
            drawnObject = drawAnimatedDrawable(drawable as AnimatedDrawable, assetService);
            break;
        default:
            drawnObject = null;
            break;
    }

    if (drawnObject) {
        applyDrawableProperties(drawable, drawnObject);
    }
    return drawnObject;
}

function drawShapeDrawable(shapeDrawable : ShapeDrawable) : DisplayObject {
    var graphics = new Graphics();
    var colorHex = colorToHex(shapeDrawable.shape.fillColor);
    graphics.beginFill(parseInt(colorHex, 16), 1);
    graphics.fillAlpha = shapeDrawable.shape.fillColor.a / 255;
    let shapeType = cppTypeToShapeType(shapeDrawable.shape.__cpp_type)
    switch (shapeType) {
        case ShapeType.Circle:
            var radius = (shapeDrawable.shape as Circle).radius;
            drawEllipse({x: 0, y: 0}, radius, radius, graphics);
            break;
        case ShapeType.Rectangle:
            var dimension = (shapeDrawable.shape as Rectangle).dimension;
            drawRectangle({x: 0, y: 0}, dimension, graphics);
            break;
    }
    graphics.endFill();
    return graphics;
}

function drawContainerDrawable(containerDrawable : ContainerDrawable, assetService : AssetService) : ContainerConstruct {
    if (!containerDrawable.drawables || containerDrawable.drawables.length === 0) {
        return {
            type: "CONTAINER",
            childConstructs: []
        };
    }

    let childConstructs : DrawnConstruct[] = []
    for (let drawable of containerDrawable.drawables) {
        childConstructs = childConstructs.concat(drawDrawable(drawable, assetService));
    }
    return {
        type: "CONTAINER",
        childConstructs: childConstructs
    };
}

function drawAnimatedDrawable(animatedDrawable : AnimatedDrawable, assetService : AssetService) : AnimationConstruct {
    if (!animatedDrawable.frames || animatedDrawable.frames.length === 0) {
        return {
            type: "ANIMATION",
            duration: 0,
            frames: []
        }
    }

    let framesDisplayObjects : DrawnConstruct[] = [];
    for (let frame of animatedDrawable.frames) {
        framesDisplayObjects.push(drawDrawable(frame, assetService));
    }

    return {
        type: "ANIMATION",
        duration: animatedDrawable.duration,
        frames: framesDisplayObjects
    }
}

function drawImageDrawable(imageDrawable : ImageDrawable, assetService : AssetService) : DisplayObject {
    if (!imageDrawable.textureKey) {
        return new DisplayObject();
    }

    let baseTexture = assetService.get(imageDrawable.textureKey);
    if (!baseTexture) {
        return new DisplayObject();
    }
    let texture : Texture;
    if (imageDrawable.isWholeImage) {
        texture = new Texture(baseTexture);
    } else {
        texture = new Texture(baseTexture, new PIXI.Rectangle(
            imageDrawable.textureRect.position.x,
            imageDrawable.textureRect.position.y,
            imageDrawable.textureRect.dimension.x,
            imageDrawable.textureRect.dimension.y));
    }
    let sprite = new Sprite(texture);
    sprite.x = -sprite.width / 2;
    sprite.y = -sprite.height / 2;
    let container = new Container();
    container.addChild(sprite);
    return container;
}

function applyDrawableProperties(drawable : Drawable, drawableDisplayObject : DrawnConstruct) {
    function applyDisplayObjectProperties(displayObject : DisplayObject) {
        displayObject.scale.x *= drawable.scale.x;
        displayObject.scale.y *= drawable.scale.y;
        displayObject.rotation += degreesToRadians(drawable.rotation);
        displayObject.position.x += drawable.positionOffset.x;
        displayObject.position.y += drawable.positionOffset.y;
    }

    if (isAnimationConstruct(drawableDisplayObject)) {
        for (let frame of drawableDisplayObject.frames) {
            applyDrawableProperties(drawable, frame);
        }
    } else if (isContainerContruct(drawableDisplayObject)) {
        for (let child of drawableDisplayObject.childConstructs) {
            applyDrawableProperties(drawable, child);
        }
    } else if (isDisplayObject(drawableDisplayObject)) {
        applyDisplayObjectProperties(drawableDisplayObject);
    } else {
        throw Error("Unknown DrawnConstruct type in drawable-drawer::applyDrawableProperties");
    }
}

/**
 * pixi.js considers Container's children to be interactive (clickable, draggable, etc. via
 * pixi operations). Since we handle the interactive operations, we need to set the children as
 * non-interactive so pixi doesn't throw benign js errors all the time.
 * @param  drawableDrawnConstruct to make non-interactive
 */
function setNonInteractive(drawable : DrawnConstruct) {
    if (isAnimationConstruct(drawable)) {
        for (let frame of drawable.frames) {
            setNonInteractive(frame);
        }
    } else if (isContainerContruct(drawable)) {
        for (let child of drawable.childConstructs) {
            setNonInteractive(child);
        }
    } else if (isDisplayObject(drawable)) {
        drawable.interactiveChildren = false;
    } else {
        throw Error("Unknown DrawnConstruct type in drawable-drawer::setNonInteractive");
    }
}

function setPosition(drawable : DrawnConstruct, position : Vector) {
    function setDisplayObjectPosition(displayObject : DisplayObject) {
        displayObject.position.x += position.x;
        displayObject.position.y += position.y;
    }

    if (isAnimationConstruct(drawable)) {
        for (let frame of drawable.frames) {
            setPosition(frame, position);
        }
    } else if (isContainerContruct(drawable)) {
        for (let child of drawable.childConstructs) {
            setPosition(child, position);
        }
    } else if (isDisplayObject(drawable)) {
        setDisplayObjectPosition(drawable);
    } else {
        throw Error("Unknown DrawnConstruct type in drawable-drawer::setPosition");
    }
}
