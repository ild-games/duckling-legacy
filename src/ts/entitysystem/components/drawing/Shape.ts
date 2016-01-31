module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    /**
     *  Model object describing a shape.
     */
    export class Shape extends observe.SimpleObservable {
        @observe.Object()
        fillColor : Color;

        constructor(fillColor? : Color) {
            super();
            this.fillColor = fillColor || new Color(0, 0, 0, 255);
        }

        getDrawable() : createjs.DisplayObject {
            throw new Error("This method is abstract");
        }

        @serialize.Ignore
        get type() : ShapeType {
            throw new Error("This method is abstract");
        }

        @serialize.Ignore
        get factory() : ShapeFactory {
            return ShapeTypeToFactory[ShapeType[this.type]];
        }
    }

    export class ShapeViewModel<T> extends framework.ViewModel<T> {
        private colorPicker : controls.ColorPickerControl;

        onViewReady() {
            super.onViewReady();

            this.colorPicker = new controls.ColorPickerControl(this, "shapeColorPicker");
        }
    }
}
