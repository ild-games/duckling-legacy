import {Drawable, DrawableType} from './drawable';

export interface ImageDrawable extends Drawable {
    textureKey : string;
    isWholeImage : boolean;
    textureRect: {
        left: number,
        top: number,
        width: number,
        height: number
    }
}

export var defaultImageDrawable : ImageDrawable = {
    __cpp_type: "ild::ImageDrawable",
    type: DrawableType.Image,
    key: "ImageDrawable",
    inactive: false,
    renderPriority: 0,
    scale: {
        x: 1,
        y: 1
    },
    rotation: 0,
    positionOffset: {
        x: 0,
        y: 0
    },
    priorityOffset: 0,
    textureKey: "",
    isWholeImage: true,
    textureRect: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    }
}
