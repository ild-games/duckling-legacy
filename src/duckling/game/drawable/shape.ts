import { Color } from "../../canvas/drawing/color";

export enum ShapeType {
    Circle,
    Rectangle,
}

export function cppTypeToShapeType(cppType: string): ShapeType {
    switch (cppType) {
        case "ildhal::CircleShape":
            return ShapeType.Circle;
        case "ildhal::RectangleShape":
            return ShapeType.Rectangle;
    }
}

export function shapeTypeToCppType(type: ShapeType): string {
    switch (type) {
        case ShapeType.Circle:
            return "ildhal::CircleShape";
        case ShapeType.Rectangle:
            return "ildhal::RectangleShape";
    }
}

export interface Shape {
    __cpp_type: string;
    fillColor: Color;
}

export let defaultShape: Shape = {
    __cpp_type: "",
    fillColor: {
        r: 67,
        g: 154,
        b: 202,
        a: 255,
    },
};
