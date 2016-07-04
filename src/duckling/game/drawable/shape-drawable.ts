import {Drawable, DrawableType} from './drawable';
import {Shape} from './shape';

export interface ShapeDrawable extends Drawable {
    shape: Shape;
    color: string;
}

export var defaultShapeDrawable : ShapeDrawable = {
    type: DrawableType.Shape,
    renderPriority: 0,
    scale: {
        x: 1,
        y: 1
    },
    rotation: 0,
    color: "000000",
    bounds: {
        x: 0,
        y: 0
    },
    shape: {
        type: null
    }
}
