import {Vector} from '../../math';

import {Shape, ShapeType} from './shape';

export interface Rectangle extends Shape {
    dimension: Vector;
}

export var defaultRectangle : Rectangle = {
    type: ShapeType.Rectangle,
    dimension: {
        x: 10,
        y: 10
    }
};
