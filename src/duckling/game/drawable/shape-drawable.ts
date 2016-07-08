import {Drawable, DrawableType} from './drawable';
import {Shape} from './shape';

export interface ShapeDrawable extends Drawable {
    shape: Shape;
}

export var defaultShapeDrawable : ShapeDrawable = {
    __cpp_type: "ild::ShapeDrawable",
    type: DrawableType.Shape,
    key: "ShapeDrawable",
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
    shape: {
        __cpp_type: null,
        fillColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 255
        },
        type: null,
    }
}
