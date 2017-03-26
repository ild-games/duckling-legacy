import {RenderTexture, Texture, Sprite, Graphics, DisplayObject, Container, BaseTexture} from 'pixi.js';

import {drawMissingAsset} from '../../canvas/drawing/util';
import {Vector} from '../../math/vector';
import {AssetService} from '../../project/asset.service';

import {TileBlockDrawable, getTileWidth} from './tile-block-drawable';

export function drawTileBlockDrawable(tileBlockDrawable : TileBlockDrawable, assetService : AssetService) : DisplayObject {
    if (!tileBlockDrawable.textureKey) {
        return null;
    }

    let baseTexture = assetService.get({key: tileBlockDrawable.textureKey, type: "TexturePNG"});
    if (!baseTexture) {
        return drawMissingAsset(assetService);
    }
    
    return _constructTileBlockSprite(tileBlockDrawable, baseTexture, assetService);
}

function _constructTileBlockSprite(tileBlockDrawable : TileBlockDrawable, baseTexture : BaseTexture, assetService : AssetService) : DisplayObject {
    let tileSize = getTileWidth(tileBlockDrawable, assetService);
    if (tileSize <= 0) {
        return drawMissingAsset(assetService);
    }
    let numberOfTiles = { x: tileBlockDrawable.size.x / tileSize, y: tileBlockDrawable.size.y / tileSize};
    
    let positions = _getPositions(numberOfTiles);
    let calculateOffset: {x: boolean, y: boolean} = _getOffsets(numberOfTiles);
    
    return _constructTileBlockContainer(positions, calculateOffset, baseTexture, tileSize, numberOfTiles);
}

function _getPositions(numberOfTiles: Vector): Vector[] {
    let positions: Vector[] = [];
    
    for (let x of _getAxisPositions(numberOfTiles.x)) {
        for (let y of _getAxisPositions(numberOfTiles.y)) {
            positions.push({x, y});
        }
    }

    return positions;
}

function _getAxisPositions(numberOfTilesOnAxis: number): number[] {
    if (numberOfTilesOnAxis > 1) {
        return [0,1,2];
    } else {
        return [3];
    }
}

function _getOffsets(numberOfTiles: Vector): { x : boolean, y: boolean } {
    return {x: numberOfTiles.x !==1, y: numberOfTiles.y !== 1};
}


function _constructTileBlockContainer(positions: Vector[], calculateOffset: { x: boolean, y: boolean}, baseTexture: BaseTexture, tileSize: number, numberOfTiles: Vector): Container {
    let container = new Container();

    for (let position of positions) {
        let texture = new Texture(baseTexture, new PIXI.Rectangle(position.x * tileSize, position.y * tileSize, tileSize, tileSize));
        let sprite = _getSprite(position, numberOfTiles, tileSize, texture, calculateOffset);
        container.addChild(sprite);
    }

    return container;
}

function _getSprite(position: Vector, numberOfTiles: Vector, tileSize: number, texture: Texture, calculateOffset: { x : boolean, y : boolean}): DisplayObject | null {
    // Only tiles in row/column 1 (0 indexed) are ever repeated
    if (position.x === 1 || position.y === 1){
        return _getTiledSprite(position, numberOfTiles, tileSize, texture, calculateOffset);
    } else {
        let sprite = new Sprite(texture);
        sprite.x = calculateOffset.x? _getSpriteOffset(position.x, numberOfTiles.x, tileSize): sprite.x;
        sprite.y = calculateOffset.y? _getSpriteOffset(position.y, numberOfTiles.y, tileSize): sprite.y;
        return sprite;
    }
}

function _getTiledSprite(position: Vector, numberOfTiles: Vector, tileSize:number, texture: Texture, calculateOffset: {x: boolean, y: boolean}): DisplayObject {
    let tileAreaSizes = _getTileAreaSizes(position, numberOfTiles, tileSize);
    let sprite = new (<any>PIXI).TilingSprite(texture, tileAreaSizes.x, tileAreaSizes.y);
    sprite.x = calculateOffset.x? _getSpriteOffset(position.x, numberOfTiles.x, tileSize): sprite.x;
    sprite.y = calculateOffset.y? _getSpriteOffset(position.y, numberOfTiles.y, tileSize): sprite.y;
    return sprite;
}

function _getTileAreaSizes(position: Vector, numberOfTiles: Vector, tileSize: number): Vector {
    let tileAreaSizes = { x: tileSize, y:tileSize };
    if (position.x === 1 && numberOfTiles.x !== 1){
        tileAreaSizes.x = (numberOfTiles.x - 2) * tileSize; 
    }
    if (position.y === 1 && numberOfTiles.y !== 1){
        tileAreaSizes.y = (numberOfTiles.y - 2) * tileSize;
    }
    return tileAreaSizes;
}

function _getSpriteOffset(position: number, numberOfTiles: number, tileSize: number): number {
    let numTileOffset = position;
    if (position === 2) {
        numTileOffset = numberOfTiles - 1; // Account for middle section
    }
    return numTileOffset * tileSize;
}


