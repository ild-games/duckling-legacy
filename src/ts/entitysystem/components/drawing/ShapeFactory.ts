module entityframework.components.drawing {
    export interface ShapeFactory extends framework.VMFactory {
        createShape() : Shape;
    }
}
