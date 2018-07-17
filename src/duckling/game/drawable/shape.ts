import { Color } from "../../canvas/drawing/color";

export enum ShapeType {
  Circle,
  Rectangle
}

export function cppTypeToShapeType(cppType: string): ShapeType {
  switch (cppType) {
    case "sf::CircleShape":
      return ShapeType.Circle;
    case "sf::RectangleShape":
      return ShapeType.Rectangle;
  }
}

export function shapeTypeToCppType(type: ShapeType): string {
  switch (type) {
    case ShapeType.Circle:
      return "sf::CircleShape";
    case ShapeType.Rectangle:
      return "sf::RectangleShape";
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
    a: 255
  }
};
