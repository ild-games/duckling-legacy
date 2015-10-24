///<reference path="../../../math/Vector.ts"/>
///<reference path="Shape.ts"/>
///<reference path="../../../util/JsonLoader.ts"/>
module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    @serialize.ProvideClass(CircleShape, "sf::CircleShape")
    export class CircleShape extends Shape implements editorcanvas.drawing.CanvasDrawnElement {
        @observe.Primitive(Number)
        radius : number;

        constructor(radius? : number) {
            super();
            this.radius = radius || 0;
        }

        getDrawable(position : math.Vector) {
            var easelCircle = new createjs.Shape();
            easelCircle.graphics.beginFill(this.fillColor.rgbaStringFormat()).drawCircle(position.x, position.y, this.radius);
            return easelCircle;
        }

        get type() : ShapeType {
            return ShapeType.Circle;
        }

        getDrawable(position : math.Vector) {
            var easelCircle = new createjs.Shape();
            easelCircle.graphics.beginFill(this.fillColor.rgbaStringFormat()).drawCircle(position.x, position.y, this.radius);
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
