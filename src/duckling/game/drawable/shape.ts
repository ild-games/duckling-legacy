import {Color} from '../../canvas/drawing/color';

export enum ShapeType {
    Circle,
    Rectangle
}

export interface Shape {
    __cpp_type: string,
    fillColor: Color,
    type: ShapeType
}
