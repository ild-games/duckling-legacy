import {immutableAssign} from '../../util';
import {Vector} from '../../math/vector';
import {AssetService} from '../../project/asset.service';

import {Drawable, defaultDrawable} from './drawable';

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
    },
    tileDimension: {
        x: 3,
        y: 3
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
