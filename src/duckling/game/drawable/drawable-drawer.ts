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
import {DrawnConstruct, TransformProperties} from '../../canvas/drawing/drawn-construct';
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

function _drawShapeDrawable(shapeDrawable : ShapeDrawable) : ShapeDrawnConstruct {
    let drawnConstruct = new ShapeDrawnConstruct();
    drawnConstruct.shapeDrawable = shapeDrawable;
    return drawnConstruct;
}

function _drawImageDrawable(imageDrawable : ImageDrawable, assetService : AssetService) : DrawnConstruct {
    try {
        let texture = _getTexture(imageDrawable, assetService);
        if (!texture) {
            return null;
        }

        let drawnConstruct = new ImageDrawnConstruct();
        drawnConstruct.imageDrawable = imageDrawable;
        drawnConstruct.texture = texture;
        return drawnConstruct;
    } catch(e) {
        console.log(e.message);
        return drawMissingAsset(assetService);
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
    return drawnConstruct;
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
    return drawnConstruct;
}

function _drawTextDrawable(textDrawable : TextDrawable, assetService : AssetService) : DrawnConstruct {
    let drawnConstruct = new TextDrawnConstruct();
    drawnConstruct.textDrawable = textDrawable;
    let fontKey = this.textDrawable.text.fontKey || "Arial";
    drawnConstruct.fontFamily = this.assetService.fontFamilyFromAssetKey(fontKey);
    return drawnConstruct;
}

export class ShapeDrawnConstruct extends DrawnConstruct {
    shapeDrawable : ShapeDrawable;

    drawable(totalMillis : number) : DisplayObject {
        let graphics = new Graphics();
        let colorHex = colorToHex(this.shapeDrawable.shape.fillColor);
        graphics.beginFill(parseInt(colorHex, 16), 1);
        graphics.fillAlpha = this.shapeDrawable.shape.fillColor.a / 255;
        let shapeType = cppTypeToShapeType(this.shapeDrawable.shape.__cpp_type)
        switch (shapeType) {
            case ShapeType.Circle:
                let radius = (this.shapeDrawable.shape as Circle).radius;
                drawEllipse({x: 0, y: 0}, radius, radius, graphics);
                break;
            case ShapeType.Rectangle:
                let dimension = (this.shapeDrawable.shape as Rectangle).dimension;
                drawRectangle({x: 0, y: 0}, dimension, graphics);
                break;
        }
        graphics.endFill();
        this._applyDisplayObjectTransforms(graphics);
        return graphics;
    }
}

export class ImageDrawnConstruct extends DrawnConstruct {
    imageDrawable : ImageDrawable;
    texture : Texture;

    private _sprite : DisplayObject = null;

    drawable(totalMillis : number) : DisplayObject {
        if (this._sprite === null) {
            if (this.imageDrawable.isTiled && this.imageDrawable.tiledArea) {
                this._sprite = new extras.TilingSprite(this.texture, this.imageDrawable.tiledArea.x, this.imageDrawable.tiledArea.y);
            } else {
                this._sprite = new Sprite(this.texture);
            }
            this._applyDisplayObjectTransforms(this._sprite);
        }
        return this._sprite;
    }
}

export class ContainerDrawnConstruct extends DrawnConstruct {
    childConstructs : DrawnConstruct[] = [];

    private _container : Container = null;

    drawable(totalMillis : number) : DisplayObject {
        if (this._container === null) {
            this._container = new Container();
            for (let childConstruct of this.childConstructs) {
                let childDisplayObject = childConstruct.drawable(totalMillis);
                if (childDisplayObject) {
                    this._container.addChild(childDisplayObject);
                }
            }
            this._applyDisplayObjectTransforms(this._container);
        }
        return this._container;
    }
}

export class AnimatedDrawnConstruct extends DrawnConstruct {
    frames : DrawnConstruct[] = [];
    duration : number = 0;

    drawable(totalMillis : number) : DisplayObject {
        let container = new Container();
        let displayObject = this._determineAnimationDisplayObject(totalMillis);
        if (displayObject) {
            container.addChild(displayObject);
        }
        this._applyDisplayObjectTransforms(container);
        return container;
    }

    private _determineAnimationDisplayObject(totalMillis : number) : DisplayObject {
        let curFrameIndex = 0;
        if (this.duration !== 0) {
            curFrameIndex = Math.trunc(totalMillis / (this.duration * 1000)) % this.frames.length;
        }

        let curFrame = this.frames[curFrameIndex];
        if (curFrame) {
            return curFrame.drawable(totalMillis);
        }
        return null;
    }
}

export class TextDrawnConstruct extends DrawnConstruct {
    textDrawable : TextDrawable;
    fontFamily : string;

    drawable(totalMillis : number) : DisplayObject {
        let colorHex = "#" + colorToHex(this.textDrawable.text.color);
        let text = new Text(
            this.textDrawable.text.text,
            {
                fontFamily: this.fontFamily,
                fontSize: this.textDrawable.text.characterSize,
                fill: colorHex
            } as PIXI.TextStyle);
        this._applyDisplayObjectTransforms(text);
        return text;
    }
}
