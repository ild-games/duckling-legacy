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

export var defaultShape : Shape = {
    __cpp_type: "",
    type: null,
    fillColor: {
        r: 0,
        g: 0,
        b: 0,
        a: 255
    }
};
