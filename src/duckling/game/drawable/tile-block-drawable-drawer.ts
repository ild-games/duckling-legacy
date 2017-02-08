import {RenderTexture, Texture, Sprite, Graphics, DisplayObject, Container, BaseTexture} from 'pixi.js';

import {Vector} from '../../math/vector';
import {AssetService} from '../../project/asset.service';

import {TileBlockDrawable, getTileWidth} from './tile-block-drawable';

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
    let calculateOffset: {x: boolean, y: boolean} = _getOffsets(tiles);
    
    return _constructTileBlockContainer(positions, calculateOffset, baseTexture, tileSize, tiles);
}

function _getPositions(tiles: Vector): Vector[] {
    let positions: Vector[] = [];
    
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

function _getOffsets(tiles: Vector): { x : boolean, y: boolean } {
    let calculateOffset: { x: boolean, y: boolean } = { x: true, y: true };
    if (tiles.x === 1) {
        calculateOffset.x = false;
    } 
    if (tiles.y === 1) {
        calculateOffset.y = false;
    } 
    return calculateOffset;
}


function _constructTileBlockContainer(positions: Vector[], calculateOffset: { x: boolean, y: boolean}, baseTexture: BaseTexture, tileSize: number, tiles: Vector): Container {
    let texture: Texture;
    let sprite: DisplayObject;
    let container = new Container();

    for (let position of positions) {
        texture = new Texture(baseTexture, new PIXI.Rectangle(position.x * tileSize, position.y * tileSize, tileSize, tileSize));
        sprite = _getSprite(position, tiles, tileSize, texture, calculateOffset);
        if (sprite === null) { continue; }
        container.addChild(sprite);
    }

    return container;
}

function _getSprite(position: Vector, tiles: Vector, tileSize: number, texture: Texture, calculateOffset: { x : boolean, y : boolean}): DisplayObject | null {
    let sprite: DisplayObject;
 
    // Only tiles in row/column 1 (0 indexed) are ever repeated
    if (position.x === 1 || position.y === 1){
        sprite = _getTiledSprite(position, tiles, tileSize, texture);
        if (sprite === null) { return null; } 
    } else {
        sprite = new Sprite(texture);
    }

    // Unless offsets have been overridden, calculate offsets
    if (calculateOffset.x) {
        sprite.x = _getSpriteOffset(position.x, tiles.x, tileSize);
    }
    if (calculateOffset.y) {
        sprite.y = _getSpriteOffset(position.y, tiles.y, tileSize);
    }

    return sprite;
}

function _getTiledSprite(position: Vector, tiles: Vector, tileSize:number, texture: Texture): DisplayObject | null {
    let tileAreaWidth = tileSize;
    let tileAreaHeight = tileSize;
    if (position.x === 1 && tiles.x !== 1){
        tileAreaWidth = (tiles.x - 2) * tileSize; 
    }
    if (position.y === 1 && tiles.y !== 1){
        tileAreaHeight = (tiles.y - 2) * tileSize;
    }

    if (tileAreaHeight === 0 || tileAreaWidth === 0) { return null; }

    return new (<any>PIXI).TilingSprite(texture, tileAreaWidth, tileAreaHeight)
}

function _getSpriteOffset(position: number, numTiles: number, tileSize: number): number {
    let numTileOffset = position;
    if (position === 2) {
        numTileOffset = numTiles - 1; // Account for middle section
    }
    return numTileOffset * tileSize;
}


