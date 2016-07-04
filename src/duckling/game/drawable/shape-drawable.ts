import {Drawable, DrawableType} from './drawable';
import {Shape} from './shape';

export interface ShapeDrawable extends Drawable {
    shape: Shape;
}

export var defaultShapeDrawable : ShapeDrawable = {
    type: DrawableType.Shape,
    scale: {
        x: 1,
        y: 1
    },
    rotation: 0,
    color: "000000",
    shape: {
        type: null
    }
}
