import {Drawable, DrawableType} from './drawable';
import {Shape} from './shape';

export interface ShapeDrawable extends Drawable {
    shape: Shape;
}

export var defaultShapeDrawable : ShapeDrawable = {
    type: DrawableType.Shape,
    shape: {
        type: null
    }
}
