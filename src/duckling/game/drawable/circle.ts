import {Shape, ShapeType} from './shape';

export interface Circle extends Shape {
    radius: number;
}

export var defaultCircle : Circle = {
    __cpp_type: "sf::CircleShape",
    type: ShapeType.Circle,
    fillColor: {
        r: 0,
        g: 0,
        b: 0,
        a: 255
    },
    radius: 10
};
