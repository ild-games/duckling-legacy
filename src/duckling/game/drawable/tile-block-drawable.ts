import {RenderTexture, Texture, Sprite, Graphics, DisplayObject, Container, BaseTexture} from 'pixi.js';

import {immutableAssign} from '../../util';
import {Box2} from '../../math';
import {Vector} from '../../math/vector';
import {AssetService, Asset} from '../../project/asset.service';

import {Drawable, DrawableType, defaultDrawable} from './drawable';

export interface TileBlockDrawable extends Drawable {
    textureKey : string;
    size: Vector;
    tileDimension: Vector;
}

export let defaultTileBlockDrawable : TileBlockDrawable = immutableAssign(defaultDrawable as TileBlockDrawable, {
    __cpp_type: "ild::TileBlockDrawable",
    key: "TileBlockDrawable",
    textureKey: "",
    size: {
        x: 100,
        y: 100
    }
});
    
export function getTileWidth(tileBlockDrawable : TileBlockDrawable, assetService : AssetService) : number {
    if (!tileBlockDrawable.textureKey) {
        return 0;
    }
    
    let width = assetService.getImageAssetDimensions({key: tileBlockDrawable.textureKey, type: "TexturePNG"}).width;
    return width / 4;
}

export function getTileHeight(tileBlockDrawable : TileBlockDrawable, assetService : AssetService) : number {
    if (!tileBlockDrawable.textureKey) {
        return 0;
    }
    
    let height = assetService.getImageAssetDimensions({key: tileBlockDrawable.textureKey, type: "TexturePNG"}).height;
    return height / 4;
}

// Drawing functions
export function drawTileBlockDrawable(tileBlockDrawable : TileBlockDrawable, assetService : AssetService) : DisplayObject {
    if (!tileBlockDrawable.textureKey) {
        return null;
    }

    let baseTexture = assetService.get({key: tileBlockDrawable.textureKey, type: "TexturePNG"});
    if (!baseTexture) {
        return null;
    }
    
    let container = new Container();
    container.addChild(_constructTileBlockSprite(tileBlockDrawable, baseTexture, assetService));
    return container;
}

function _constructTileBlockSprite(tileBlockDrawable : TileBlockDrawable, baseTexture : BaseTexture, assetService : AssetService) : DisplayObject {
    let tileWidth = getTileWidth(tileBlockDrawable, assetService);
    let tileHeight = getTileHeight(tileBlockDrawable, assetService);
    let numTilesWidth = tileBlockDrawable.size.x / tileWidth;
    let numTilesHeight = tileBlockDrawable.size.y / tileHeight;
    
    if (numTilesWidth > 1 && numTilesHeight > 1) {
        return _constructLargeTileBlockSprite(tileBlockDrawable, baseTexture, tileWidth, tileHeight, numTilesWidth, numTilesHeight);
    } else if (numTilesWidth === 1 && numTilesHeight > 1) {
        return _constructColumnTileBlockSprite(tileBlockDrawable, baseTexture, tileWidth, tileHeight, numTilesHeight);
    } else if (numTilesWidth > 1 && numTilesHeight === 1) {
        return _constructRowTileBlockSprite(tileBlockDrawable, baseTexture, tileWidth, tileHeight, numTilesWidth);
    } else if (numTilesWidth === 1 && numTilesHeight === 1) {
        return _constructSmallTileBlockSprite(tileBlockDrawable, baseTexture, tileWidth, tileHeight);
    }
    
    return new Container();
}

function _constructLargeTileBlockSprite(tileBlockDrawable : TileBlockDrawable, baseTexture : BaseTexture, tileWidth : number, tileHeight : number, numTilesWidth : number, numTilesHeight : number) : Container {
    let container = new Container();
    let texture : Texture;
    let sprite : any;
    
    // top left
    texture = new Texture(baseTexture, new PIXI.Rectangle(0, 0, tileWidth, tileHeight));
    container.addChild(new Sprite(texture));
    
    // top middle
    if (numTilesWidth > 2) {
        texture = new Texture(baseTexture, new PIXI.Rectangle(tileWidth, 0, tileWidth, tileHeight));
        sprite = new (<any>PIXI).TilingSprite(texture, tileBlockDrawable.size.x - (tileWidth * 2), tileHeight);
        sprite.x = tileWidth;
        container.addChild(sprite);
    }
    
    // top right
    texture = new Texture(baseTexture, new PIXI.Rectangle(tileWidth * 2, 0, tileWidth, tileHeight));
    sprite = new Sprite(texture);
    sprite.x = tileBlockDrawable.size.x - tileWidth;
    container.addChild(sprite);
    
    // middle left
    if (numTilesHeight > 2) {
        texture = new Texture(baseTexture, new PIXI.Rectangle(0, tileHeight, tileWidth, tileHeight));
        sprite = new (<any>PIXI).TilingSprite(texture, tileWidth, tileBlockDrawable.size.y - (tileHeight * 2));
        sprite.y = tileHeight;
        container.addChild(sprite);
    }
    
    // middle
    if (numTilesWidth > 2 && numTilesHeight > 2) {
        texture = new Texture(baseTexture, new PIXI.Rectangle(tileWidth, tileHeight, tileWidth, tileHeight));
        sprite = new (<any>PIXI).TilingSprite(texture, tileBlockDrawable.size.x - (tileWidth * 2), tileBlockDrawable.size.y - (tileHeight * 2));
        sprite.x = tileWidth;
        sprite.y = tileHeight;
        container.addChild(sprite);
    }

    // middle right
    if (numTilesHeight > 2) {
        texture = new Texture(baseTexture, new PIXI.Rectangle(tileWidth * 2, tileHeight, tileWidth, tileHeight));
        sprite = new (<any>PIXI).TilingSprite(texture, tileWidth, tileBlockDrawable.size.y - (tileHeight * 2));
        sprite.x = tileBlockDrawable.size.x - tileWidth;
        sprite.y = tileHeight;
        container.addChild(sprite);
    }
    
    // bottom left
    texture = new Texture(baseTexture, new PIXI.Rectangle(0, tileHeight * 2, tileWidth, tileHeight));
    sprite = new Sprite(texture);
    sprite.y = tileBlockDrawable.size.y - tileHeight;
    container.addChild(sprite);
    
    // bottom middle
    if (numTilesWidth > 2) {
        texture = new Texture(baseTexture, new PIXI.Rectangle(tileWidth, tileHeight * 2, tileWidth, tileHeight));
        sprite = new (<any>PIXI).TilingSprite(texture, tileBlockDrawable.size.x - (tileWidth * 2), tileHeight);
        sprite.x = tileWidth;
        sprite.y = tileBlockDrawable.size.y - tileHeight;
        container.addChild(sprite);
    }
    
    // bottom right
    texture = new Texture(baseTexture, new PIXI.Rectangle(tileWidth * 2, tileHeight * 2, tileWidth, tileHeight));
    sprite = new Sprite(texture);
    sprite.x = tileBlockDrawable.size.x - tileWidth;
    sprite.y = tileBlockDrawable.size.y - tileHeight;
    container.addChild(sprite);

    return container;
}

function _constructColumnTileBlockSprite(tileBlockDrawable : TileBlockDrawable, baseTexture : BaseTexture, tileWidth : number, tileHeight : number, numTilesHeight : number) : Container {
    let container = new Container();
    let texture : Texture;
    let sprite : any;
    let startingX = tileWidth * 3;
    
    // top
    texture = new Texture(baseTexture, new PIXI.Rectangle(startingX, 0, tileWidth, tileHeight));
    container.addChild(new Sprite(texture));
    
    // middle
    if (numTilesHeight > 2) {
        texture = new Texture(baseTexture, new PIXI.Rectangle(startingX, tileHeight, tileWidth, tileHeight));
        sprite = new (<any>PIXI).TilingSprite(texture, tileWidth, tileBlockDrawable.size.y - (tileHeight * 2));
        sprite.y = tileHeight;
        container.addChild(sprite);
    }
    
    // down
    texture = new Texture(baseTexture, new PIXI.Rectangle(startingX, tileHeight * 2, tileWidth, tileHeight));
    sprite = new Sprite(texture);
    sprite.y = tileBlockDrawable.size.y - tileHeight;
    container.addChild(sprite);

    return container;
}

function _constructRowTileBlockSprite(tileBlockDrawable : TileBlockDrawable, baseTexture : BaseTexture, tileWidth : number, tileHeight : number, numTilesWidth : number) : Container {
    let container = new Container();
    let texture : Texture;
    let sprite : any;
    let startingY = tileHeight * 3;
    
    // left
    texture = new Texture(baseTexture, new PIXI.Rectangle(0, startingY, tileWidth, tileHeight));
    container.addChild(new Sprite(texture));
    
    // middle
    if (numTilesWidth > 2) {
        texture = new Texture(baseTexture, new PIXI.Rectangle(tileWidth, startingY, tileWidth, tileHeight));
        sprite = new (<any>PIXI).TilingSprite(texture, tileBlockDrawable.size.x - (tileWidth * 2), tileHeight);
        sprite.x = tileWidth;
        container.addChild(sprite);
    }
    
    // right
    texture = new Texture(baseTexture, new PIXI.Rectangle(tileWidth * 2, startingY, tileWidth, tileHeight));
    sprite = new Sprite(texture);
    sprite.x = tileBlockDrawable.size.x - tileWidth;
    container.addChild(sprite);

    return container;
}

function _constructSmallTileBlockSprite(tileBlockDrawable : TileBlockDrawable, baseTexture : BaseTexture, tileWidth : number, tileHeight : number) : Sprite {
    let texture = new Texture(baseTexture, new PIXI.Rectangle(tileWidth * 3, tileHeight * 3, tileWidth, tileHeight));
    return new Sprite(texture);
}