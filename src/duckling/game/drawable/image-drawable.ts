import {immutableAssign} from '../../util';
import {Box2} from '../../math';

import {Drawable, DrawableType, defaultDrawable} from './drawable';

export interface ImageDrawable extends Drawable {
    textureKey : string;
    isWholeImage : boolean;
    textureRect: Box2;
}

export let defaultImageDrawable : ImageDrawable = immutableAssign(defaultDrawable as ImageDrawable, {
    __cpp_type: "ild::ImageDrawable",
    type: DrawableType.Image,
    key: "ImageDrawable",
    textureKey: "",
    isWholeImage: true,
    textureRect: {
        position: {
            x: 0,
            y: 0,
        },
        dimension: {
            x: 0,
            y: 0,
        }
    }
});
