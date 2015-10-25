///<reference path="../../../math/Vector.ts"/>
///<reference path="Shape.ts"/>
///<reference path="../../../util/JsonLoader.ts"/>
module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    @serialize.ProvideClass(CircleShape, "sf::CircleShape")
    export class CircleShape extends Shape {
        @observe.Primitive(Number)
        radius : number;

        constructor(radius? : number) {
            super();
            this.radius = radius || 0;
        }

        public contains(point : math.Vector, shapePosition : math.Vector) {
            var squareDist = Math.pow(shapePosition.x - point.x, 2) + Math.pow(shapePosition.y - point.y, 2);
            return squareDist <= Math.pow(this.radius, 2);
        }
    }

    export class CircleShapeViewModel extends framework.ViewModel<CircleShape> {
        get viewFile() : string {
            return "drawables/circle_shape";
        }
    }

    export class CircleShapeFactory implements ShapeFactory {
        createFormVM() : framework.ViewModel<any> {
            return new CircleShapeViewModel();
        }

        createShape() : Shape {
            return new CircleShape();
        }
    }
}
