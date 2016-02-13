///<reference path="../../../math/Vector.ts"/>
///<reference path="Shape.ts"/>
///<reference path="../../../util/JsonLoader.ts"/>
module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    /**
     * A shape that represents a circle.
     */
    @serialize.ProvideClass(CircleShape, "sf::CircleShape")
    export class CircleShape extends Shape implements editorcanvas.drawing.CanvasDrawnElement {
        @ObservePrimitive(Number)
        radius : number;

        constructor(radius? : number) {
            super();
            this.radius = radius || 0;
        }

        getDrawable() {
            var easelCircle = new createjs.Shape();
            easelCircle.graphics.beginFill(this.fillColor.rgbaStringFormat()).
                drawCircle(0, 0, this.radius);
            return easelCircle;
        }

        get type() : ShapeType {
            return ShapeType.Circle;
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
