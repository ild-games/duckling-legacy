import {Drawable, DrawableType} from './drawable';

export interface ContainerDrawable extends Drawable {
    drawables : Drawable[];
}

export var defaultContainerDrawable : ContainerDrawable = {
    __cpp_type: "ild::ContainerDrawable",
    type: DrawableType.Container,
    key: "ContainerDrawable",
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
    bounds: {
        x: 0,
        y: 0
    },
    drawables: [
    ]
}
