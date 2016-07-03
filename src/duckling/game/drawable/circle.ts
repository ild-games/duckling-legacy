import {Shape, ShapeType} from './shape';

export interface Circle extends Shape {
    radius: number;
}

export var defaultCircle : Circle = {
    type: ShapeType.Circle,
    radius: 10
};
