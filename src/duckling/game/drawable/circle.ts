import {immutableAssign} from '../../util';

import {Shape, ShapeType, defaultShape} from './shape';

export interface Circle extends Shape {
    radius: number;
}

export let defaultCircle : Circle = immutableAssign(defaultShape as Circle, {
    __cpp_type: "sf::CircleShape",
    radius: 10
});
