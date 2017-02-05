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
    let tileSize = getTileWidth(tileBlockDrawable, assetService);
    let tiles = { x: tileBlockDrawable.size.x / tileSize, y: tileBlockDrawable.size.y / tileSize};
    
    let positions = _getPositions(tiles);
    let offsets = _getOffsets(tiles);
    
    return _constructTileBlockContainer(positions, offsets, baseTexture, tileSize, tiles);
}

function _getPositions(tiles: Vector): Vector[] {
    let positions: Vector[];
    
    let xPositions: number[] = _getAxisPositions(tiles.x);
    let yPositions: number[] = _getAxisPositions(tiles.y);
    
    let position: Vector;
    for (let xPosition of xPositions) {
        for (let yPosition of yPositions) {
            position = { x: xPosition, y: yPosition };
            positions.push(position);
        }
    }

    return positions;
}

function _getAxisPositions(numTilesOnAxis: number): number[] {
    if (numTilesOnAxis > 1) {
        return [0,1,2];
    } else {
        return [3];
    }
}

function _getOffsets(tiles: Vector): Vector {
    let offset: Vector;
    if (tiles.x === 1) {
        offset.x = 0;
    }
    if (tiles.y === 1) {
        offset.y = 0;
    }
    return offset;
}


function _constructTileBlockContainer(positions: Vector[], offsets: Vector, baseTexture: BaseTexture, tileSize: number, tiles: Vector): Container {
    let texture: Texture;
    let sprite: DisplayObject;
    let container = new Container();

    for (let position of positions) {
        texture = new Texture(baseTexture, new PIXI.Rectangle(position.x * tileSize, position.y * tileSize, tileSize, tileSize));
        sprite = _getSprite(position, tiles, tileSize, texture, offsets);
        if (sprite === null) { continue; }
        container.addChild(sprite);
    }

    return container;
}

function _getTexture(baseTexture : BaseTexture, tileSize: number, position: Vector):Texture {
    let startX: number = _getTexturePosition(position.x, tileSize);
    let startY: number = _getTexturePosition(position.y, tileSize);
}

function _getTexturePosition(position: number, tileSize: number): number {
    return position * tileSize;
}

function _getSprite(position: Vector, tiles: Vector, tileSize: number, texture: Texture, offsets: Vector): DisplayObject | null {
    let sprite: DisplayObject;
 
    // Only tiles in row/column 1 (0 indexed) are ever repeated
    if (position.x === 1 || position.y === 1){
        let tileAreaWidth = (tiles.x - 2) * tileSize;
        let tileAreaHeight = (tiles.y - 2) * tileSize;
        if (tileAreaHeight === 0 || tileAreaWidth === 0) { return null; }

        sprite = new (<any>PIXI).TilingSprite(texture, tileAreaWidth, tileAreaHeight)
    } else {
        sprite = new Sprite(texture);
    }

    // Unless offsets have been overridden, calculate offsets
    if (offsets.x === undefined || offsets.x === null) {
        sprite.x = _getSpriteOffset(position.x, tiles.x, tileSize);
    }
    if (offsets.y === undefined || offsets.y === null) {
        sprite.y = _getSpriteOffset(position.y, tiles.y, tileSize);
    }

    return sprite;
}

function _getSpriteOffset(position: number, numTiles: number, tileSize: number): number {
        let numTileOffset = position;
        if (position === 2) {
            numTileOffset = numTiles - 1; // Account for middle section
        }
        return numTileOffset * tileSize;
    }
}


