import {immutableAssign} from '../../util';
import {Vector} from '../../math';

import {Shape, ShapeType, defaultShape} from './shape';

export interface Rectangle extends Shape {
    dimension: Vector;
}

export let defaultRectangle : Rectangle = immutableAssign(defaultShape as Rectangle, {
    __cpp_type: "sf::RectangleShape",
    dimension: {
        x: 10,
        y: 10
    }
});
