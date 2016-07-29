import {ReflectiveInjector} from '@angular/core';

import {Texture, Sprite, Graphics, Container, DisplayObject} from 'pixi.js';
import * as PIXI from 'pixi.js';

import {AssetService} from '../../project';
import {getPosition} from '../position/position-attribute';
import {Entity} from '../../entitysystem/entity';
import {Vector, degreesToRadians} from '../../math';
import {colorToHex, drawEllipse, drawRectangle} from '../../canvas/drawing';

import {DrawableAttribute, getDrawableAttribute} from './drawable-attribute';
import {Drawable, DrawableType} from './drawable';
import {ShapeDrawable} from './shape-drawable';
import {ContainerDrawable} from './container-drawable';
import {ImageDrawable} from './image-drawable';
import {ShapeType, Shape} from './shape';
import {Circle} from './circle';
import {Rectangle} from './rectangle';

/**
 * Draws the drawable and bounds of the drawable for a DrawableAttribute
 * @param  entity The entity with the drawable attribute
 * @return DisplayObject that contains the drawn DrawableAttribute
 */
export function drawDrawableAttribute(entity : Entity, assetService : AssetService) : DisplayObject {
    var positionAttribute = getPosition(entity);
    var drawableAttribute = getDrawableAttribute(entity);
    if (!positionAttribute || !drawableAttribute.topDrawable) {
        return null;
    }

    var drawable = drawDrawable(drawableAttribute.topDrawable, assetService);
    if (!drawable) {
        return null;
    }

    drawable.position.x = positionAttribute.position.x;
    drawable.position.y = positionAttribute.position.y;
    return drawable;
}

function drawDrawable(drawable : Drawable, assetService : AssetService) : DisplayObject {
    if (drawable.inactive) {
        return null;
    }

    var drawableContainer = new Container();
    switch (drawable.type) {
        case DrawableType.Shape:
            drawableContainer.addChild(drawShapeDrawable(drawable as ShapeDrawable));
            break;
        case DrawableType.Container:
            drawableContainer.addChild(drawContainerDrawable(drawable as ContainerDrawable, assetService));
            break;
        case DrawableType.Image:
            drawableContainer.addChild(drawImageDrawable(drawable as ImageDrawable, assetService));
            break;
    }
    if (drawableContainer.width === 0 && drawableContainer.height === 0) {
        drawableContainer.interactiveChildren = false;
    }
    applyDrawableProperties(drawable, drawableContainer);
    return drawableContainer;
}

function drawDrawableBounds(bounds: PIXI.Rectangle) : DisplayObject {
    var graphics = new Graphics();
    graphics.lineStyle(1, 0x000000);
    drawRectangle({x: 0, y: 0}, {x: bounds.width, y: bounds.height}, graphics);
    return graphics;
}

function drawShapeDrawable(shapeDrawable : ShapeDrawable) : DisplayObject {
    var graphics = new Graphics();
    var colorHex = colorToHex(shapeDrawable.shape.fillColor);
    graphics.beginFill(parseInt(colorHex, 16), 1);
    graphics.fillAlpha = shapeDrawable.shape.fillColor.a / 255;
    switch (shapeDrawable.shape.type) {
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

function drawContainerDrawable(containerDrawable : ContainerDrawable, assetService : AssetService) : DisplayObject {
    if (!containerDrawable.drawables) {
        return new Container();
    }

    let container = new Container();
    for (let drawable of containerDrawable.drawables) {
        let childDrawable = drawDrawable(drawable, assetService);
        if (childDrawable) {
            container.addChild(childDrawable);
        }
    }
    return container;
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
    return sprite;
}

function applyDrawableProperties(drawable : Drawable, drawableDisplayObject : DisplayObject) {
    drawableDisplayObject.scale.x = drawable.scale.x;
    drawableDisplayObject.scale.y = drawable.scale.y;
    drawableDisplayObject.rotation = degreesToRadians(drawable.rotation);
}
