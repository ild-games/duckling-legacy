import {ReflectiveInjector} from '@angular/core';

import {
    RenderTexture, 
    Texture, 
    Sprite, 
    Graphics, 
    DisplayObject, 
    Container, 
    BaseTexture, 
    Point, 
    extras,
    Text
} from 'pixi.js';

import {AssetService} from '../../project';
import {Entity} from '../../entitysystem/entity';
import {Vector, degreesToRadians} from '../../math';
import {Box2} from '../../math/box2';
import {immutableAssign} from '../../util/model';
import {drawMissingAsset} from '../../canvas/drawing/util';
import {DrawnConstruct, TransformProperties, DrawableFunction, ContainerDrawnConstruct, AnimatedDrawnConstruct} from '../../canvas/drawing/drawn-construct';
import {drawEllipse, drawRectangle} from '../../canvas/drawing/util';
import {colorToHex} from '../../canvas/drawing/color';
import {AttributeDrawer} from '../../canvas/drawing/entity-drawer.service';

import {DrawableAttribute, getDrawableAttribute} from './drawable-attribute';
import {Drawable, DrawableType, cppTypeToDrawableType} from './drawable';
import {ShapeDrawable} from './shape-drawable';
import {ContainerDrawable} from './container-drawable';
import {ImageDrawable} from './image-drawable';
import {TileBlockDrawable, getTileHeight, getTileWidth} from './tile-block-drawable';
import {drawTileBlockDrawable} from './tile-block-drawable-drawer';
import {AnimatedDrawable} from './animated-drawable';
import {TextDrawable} from './text-drawable';
import {ShapeType, Shape, cppTypeToShapeType} from './shape';
import {Circle} from './circle';
import {Rectangle} from './rectangle';

export function getDrawableAttributeDrawnConstruct(drawableAttribute : DrawableAttribute, assetService : AssetService) : DrawnConstruct {
    if (!drawableAttribute.topDrawable) {
        return null;
    }

    return drawDrawable(drawableAttribute.topDrawable, assetService);
}

/**
 * Draws the drawable and bounds of the drawable for a Drawable.
 * @param entity The entity with the drawable attribute
 * @param assetService Service containing the assets needed to render the drawable attribute.
 * @param ignoreInactive Optional parameter. Set to true to ignore the inactive drawable field. Useful if you need to measure the drawn construct
 * @return DisplayObject that contains the drawn DrawableAttribute
 */
export function drawDrawable(drawable : Drawable, assetService : AssetService, ignoreInactive : boolean = false) : DrawnConstruct {
    if (drawable.inactive && !ignoreInactive) {
        return null;
    }

    let drawnConstruct : DrawnConstruct;
    let drawableType = cppTypeToDrawableType(drawable.__cpp_type);
    switch (drawableType) {
        case DrawableType.Shape:
            drawnConstruct = _drawShapeDrawable(drawable as ShapeDrawable);
            break;
        case DrawableType.Container:
            drawnConstruct = _drawContainerDrawable(drawable as ContainerDrawable, assetService, ignoreInactive);
            break;
        case DrawableType.Image:
            drawnConstruct = _drawImageDrawable(drawable as ImageDrawable, assetService);
            break;
        case DrawableType.Animated:
            drawnConstruct = _drawAnimatedDrawable(drawable as AnimatedDrawable, assetService, ignoreInactive);
            break;
        case DrawableType.Text:
            drawnConstruct = _drawTextDrawable(drawable as TextDrawable, assetService);
            break;
        case DrawableType.TileBlock:
            drawnConstruct = drawTileBlockDrawable(drawable as TileBlockDrawable, assetService);
            break;
        default:
            drawnConstruct = null;
            break;
    }

    if (drawnConstruct) {
        drawnConstruct.transformProperties.anchor = drawable.anchor;
        drawnConstruct.transformProperties.rotation = drawable.rotation;
        drawnConstruct.transformProperties.scale = drawable.scale;
    }
    return drawnConstruct;
}

function _drawShapeDrawable(shapeDrawable : ShapeDrawable) : DrawnConstruct {
    let drawnConstruct = new DrawnConstruct();
    drawnConstruct.drawable = _shapeDrawer(shapeDrawable);
    return drawnConstruct;
}

function _shapeDrawer(shapeDrawable : ShapeDrawable) : DrawableFunction {
    return (totalMillis : number, transformProperties : TransformProperties) => {
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
        applyDisplayObjectTransforms(graphics, transformProperties);
        return graphics;
    };
}

function _drawImageDrawable(imageDrawable : ImageDrawable, assetService : AssetService) : DrawnConstruct {
    try {
        let texture = _getTexture(imageDrawable, assetService);
        if (!texture) {
            return null;
        }

        let drawnConstruct = new DrawnConstruct();
        drawnConstruct.drawable = _imageDrawer(imageDrawable, texture);
        return drawnConstruct;
    } catch(e) {
        console.log(e.message);
        return drawMissingAsset(assetService)
    }
}

function _getTexture(imageDrawable : ImageDrawable, assetService : AssetService) : Texture {
    if (!imageDrawable.textureKey) {
        return null;
    }

    let baseTexture = assetService.get({key: imageDrawable.textureKey, type: "TexturePNG"});
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
            throw new Error("Partial image dimensions incorrect");
        }
    }
    return texture;
}

function _isPartialImageValidForTexture(imageDrawable : ImageDrawable, texture : Texture) {
    return (
        imageDrawable.textureRect.position.x + imageDrawable.textureRect.dimension.x <= texture.frame.width &&
        imageDrawable.textureRect.position.y + imageDrawable.textureRect.dimension.y <= texture.frame.height
    );
}

function _imageDrawer(imageDrawable : ImageDrawable, texture : Texture) : DrawableFunction {
    return (totalMillis : number, transformProperties : TransformProperties) => {
        let sprite : any;
        if (imageDrawable.isTiled && imageDrawable.tiledArea) {
            sprite = new extras.TilingSprite(texture, imageDrawable.tiledArea.x, imageDrawable.tiledArea.y);
        } else {
            sprite = new Sprite(texture);
        }
        applyDisplayObjectTransforms(sprite, transformProperties);
        return sprite;
    };
}

function _drawContainerDrawable(containerDrawable : ContainerDrawable, assetService : AssetService, ignoreInactive : boolean) : ContainerDrawnConstruct {
    if (!containerDrawable.drawables || containerDrawable.drawables.length === 0) {
        return null;
    }

    let drawnConstruct = new ContainerDrawnConstruct();
    for (let drawable of containerDrawable.drawables) {
        let childDrawable = drawDrawable(drawable, assetService, ignoreInactive);
        if (childDrawable) {
            drawnConstruct.childConstructs.push(childDrawable);
        }
    }
    drawnConstruct.drawable = _containerDrawer(drawnConstruct.childConstructs);
    return drawnConstruct;
}

function _containerDrawer(childConstructs : DrawnConstruct[]) : DrawableFunction {
    return (totalMillis : number, transformProperties : TransformProperties) => {
        let container = new Container();
        for (let childConstruct of childConstructs) {
            if (childConstruct.drawable) {
                let childDisplayObject = childConstruct.drawable(totalMillis, childConstruct.transformProperties);
                if (childDisplayObject) {
                    container.addChild(childDisplayObject);
                }
            }
        }
        applyDisplayObjectTransforms(container, transformProperties);
        return container;
    };
}

function _drawAnimatedDrawable(animatedDrawable : AnimatedDrawable, assetService : AssetService, ignoreInactive : boolean) : AnimatedDrawnConstruct {
    if (!animatedDrawable.frames || animatedDrawable.frames.length === 0) {
        return null;
    }

    let drawnConstruct = new AnimatedDrawnConstruct();
    for (let frame of animatedDrawable.frames) {
        let frameDrawable = drawDrawable(frame, assetService, ignoreInactive);
        if (frameDrawable) {
            drawnConstruct.frames.push(frameDrawable);
        }
    }
    drawnConstruct.duration = animatedDrawable.duration;
    drawnConstruct.drawable = _animationDrawer(drawnConstruct.frames, drawnConstruct.duration);
    return drawnConstruct;
}

function _animationDrawer(frames : DrawnConstruct[], duration : number) : DrawableFunction {
    return (totalMillis : number, transformProperties : TransformProperties) => {
        let container = new Container();
        let displayObject = _determineAnimationDisplayObject(frames, duration, totalMillis);
        if (displayObject) {
            container.addChild(displayObject);
        }
        applyDisplayObjectTransforms(container, transformProperties);
        return container;
    }
}

function _determineAnimationDisplayObject(frames : DrawnConstruct[], duration : number, totalMillis : number) : DisplayObject {
    let curFrameIndex = 0;
    if (duration !== 0) {
        curFrameIndex = Math.trunc(totalMillis / (duration * 1000)) % frames.length;
    }

    let curFrame = frames[curFrameIndex];
    if (curFrame && curFrame.drawable) {
        return curFrame.drawable(totalMillis, curFrame.transformProperties);
    }
    return null;
}

function _drawTextDrawable(textDrawable : TextDrawable, assetService : AssetService) : DrawnConstruct {
    let drawnConstruct = new DrawnConstruct();
    drawnConstruct.drawable = _textDrawer(textDrawable, assetService);
    return drawnConstruct;
}

function _textDrawer(textDrawable : TextDrawable, assetService : AssetService) : DrawableFunction {
    return (totalMillis : number , transformProperties : TransformProperties) => {
        let fontKey = textDrawable.text.fontKey || "Arial";
        let colorHex = "#" + colorToHex(textDrawable.text.color);
        let text = new Text(
            textDrawable.text.text,
            {
                fontFamily: assetService.fontFamilyFromAssetKey(fontKey),
                fontSize: textDrawable.text.characterSize,
                fill: colorHex
            } as PIXI.TextStyle);
        applyDisplayObjectTransforms(text, transformProperties);
        return text;
    };
}

export function applyDisplayObjectTransforms(displayObject : DisplayObject, transformProperties : TransformProperties) {
    let bounds = _displayObjectBounds(displayObject);
    displayObject.rotation = degreesToRadians(transformProperties.rotation);
    displayObject.scale = transformProperties.scale as Point;
    displayObject.pivot.x = bounds.dimension.x * transformProperties.anchor.x;
    displayObject.pivot.y = bounds.dimension.y * transformProperties.anchor.y;
    displayObject.position = transformProperties.position as Point;
}

function _displayObjectBounds(displayObject : DisplayObject) : Box2 {
    if (!displayObject) {
        return null;
    }

    let container = new Container();
    container.addChild(displayObject);
    displayObject.updateTransform();
    let displayObjectBounds = container.getBounds();
    return {
        position: {x: displayObjectBounds.x, y: displayObjectBounds.y},
        dimension: {x: displayObjectBounds.width, y: displayObjectBounds.height},
        rotation: 0
    };
}
