import {immutableAssign} from '../../util';

import {Shape, ShapeType, defaultShape} from './shape';

export interface Oval extends Shape {
    radiusWidth: number;
    radiusHeight: number;
}

export let defaultOval : Oval = immutableAssign(defaultShape as Oval, {
    __cpp_type: "sf::OvalShape",
    radiusWidth: 10,
    radiusHeight: 10
});
