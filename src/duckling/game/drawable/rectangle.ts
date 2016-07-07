import {Vector} from '../../math';

import {Shape, ShapeType} from './shape';

export interface Rectangle extends Shape {
    dimension: Vector;
}

export var defaultRectangle : Rectangle = {
    __cpp_type: "sf::RectangleShape",
    type: ShapeType.Rectangle,
    fillColor: {
        r: 0,
        g: 0,
        b: 0,
        a: 255
    },
    dimension: {
        x: 10,
        y: 10
    }
};
