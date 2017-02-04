import {immutableAssign} from '../../util';
import {Box2} from '../../math';
import {Vector} from '../../math/vector';

import {Drawable, DrawableType, defaultDrawable} from './drawable';

export interface TileBlockDrawable extends Drawable {
    textureKey : string;
    dimension: Vector;
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