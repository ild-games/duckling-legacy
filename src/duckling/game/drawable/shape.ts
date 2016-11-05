import {Color} from '../../canvas/drawing/color';

export enum ShapeType {
    Oval,
    Rectangle
}

export function cppTypeToShapeType(cppType : string) : ShapeType {
    switch (cppType) {
        case "sf::OvalShape":
            return ShapeType.Oval;
        case "sf::RectangleShape":
            return ShapeType.Rectangle;
    }
}

export function shapeTypeToCppType(type : ShapeType) : string {
    switch (type) {
        case ShapeType.Oval:
            return "sf::OvalShape";
        case ShapeType.Rectangle:
            return "sf::RectangleShape";
    }
}

export interface Shape {
    __cpp_type: string,
    fillColor: Color,
}

export let defaultShape : Shape = {
    __cpp_type: "",
    fillColor: {
        r: 0,
        g: 0,
        b: 0,
        a: 255
    }
};
