import {ReflectiveInjector} from '@angular/core';

import {Texture, Sprite, Graphics, DisplayObject, Container} from 'pixi.js';
import * as PIXI from 'pixi.js';

import {AssetService} from '../../project';
import {getPosition} from '../position/position-attribute';
import {Entity} from '../../entitysystem/entity';
import {Vector, degreesToRadians} from '../../math';
import {colorToHex, drawEllipse, drawRectangle, Animation, DrawnConstruct, isAnimation} from '../../canvas/drawing';

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
export function drawDrawableAttribute(entity : Entity, assetService : AssetService) : DrawnConstruct[] {
    let positionAttribute = getPosition(entity);
    let drawableAttribute = getDrawableAttribute(entity);
    if (!positionAttribute || !drawableAttribute.topDrawable) {
        return [];
    }

    let drawableParts = drawDrawable(drawableAttribute.topDrawable, assetService);
    setNonInteractive(drawableParts);
    setPosition(drawableParts, positionAttribute.position);

    return drawableParts;
}

function drawDrawable(drawable : Drawable, assetService : AssetService) : DrawnConstruct[] {
    if (drawable.inactive) {
        return [];
    }

    let drawnObjects : DrawnConstruct[] = [];
    let drawableType = cppTypeToDrawableType(drawable.__cpp_type);
    switch (drawableType) {
        case DrawableType.Shape:
            drawnObjects.push(drawShapeDrawable(drawable as ShapeDrawable));
            break;
        case DrawableType.Container:
            drawnObjects = drawnObjects.concat(drawContainerDrawable(drawable as ContainerDrawable, assetService));
            break;
        case DrawableType.Image:
            drawnObjects.push(drawImageDrawable(drawable as ImageDrawable, assetService));
            break;
        case DrawableType.Animated:
            drawnObjects.push(drawAnimatedDrawable(drawable as AnimatedDrawable, assetService));
            break;
    }
    applyDrawableProperties(drawable, drawnObjects);
    return drawnObjects;
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

function drawContainerDrawable(containerDrawable : ContainerDrawable, assetService : AssetService) : DrawnConstruct[] {
    if (!containerDrawable.drawables || containerDrawable.drawables.length === 0) {
        return [];
    }

    let containedDrawnConstructs : DrawnConstruct[] = []
    for (let drawable of containerDrawable.drawables) {
        containedDrawnConstructs = containedDrawnConstructs.concat(drawDrawable(drawable, assetService));
    }
    return containedDrawnConstructs;
}

function drawAnimatedDrawable(animatedDrawable : AnimatedDrawable, assetService : AssetService) : Animation {
    if (!animatedDrawable.frames || animatedDrawable.frames.length === 0) {
        return {
            duration: 0,
            frames: []
        }
    }

    let framesDisplayObjects : DisplayObject[] = [];
    for (let frame of animatedDrawable.frames) {
        let drawnFramePieces = drawDrawable(frame, assetService) as DisplayObject[];
        let drawnFrame = new Container();
        for (let drawnFramePiece of drawnFramePieces) {
            drawnFrame.addChild(drawnFramePiece);
        }
        framesDisplayObjects.push(drawnFrame);
    }
    return {
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

function applyDrawableProperties(drawable : Drawable, drawableDisplayObjects : DrawnConstruct[]) {
    function applyDisplayObjectProperties(displayObject : DisplayObject) {
        displayObject.scale.x *= drawable.scale.x;
        displayObject.scale.y *= drawable.scale.y;
        displayObject.rotation += degreesToRadians(drawable.rotation);
    }

    for (let drawableDisplayObject of drawableDisplayObjects) {
        if (isAnimation(drawableDisplayObject)) {
            (drawableDisplayObject as Animation).frames.forEach(frame => applyDisplayObjectProperties(frame));
        } else {
            applyDisplayObjectProperties(drawableDisplayObject as DisplayObject);
        }
    }
}

function setNonInteractive(drawables : DrawnConstruct[]) {
    for (let drawable of drawables) {
        if (isAnimation(drawable)) {
            (drawable as Animation).frames.forEach(frame => frame.interactiveChildren = false);
        } else {
            (drawable as DisplayObject).interactiveChildren = false;
        }
    }
}

function setPosition(drawables : DrawnConstruct[], position : Vector) {
    function setDisplayObjectPosition(displayObject : DisplayObject) {
        displayObject.position.x += position.x;
        displayObject.position.y += position.y;
    }

    for (let drawable of drawables) {
        if (isAnimation(drawable)) {
            (drawable as Animation).frames.forEach(frame => setDisplayObjectPosition(frame));
        } else {
            setDisplayObjectPosition(drawable as DisplayObject);
        }
    }
}
