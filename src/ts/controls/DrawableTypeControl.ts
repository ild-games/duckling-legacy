module controls {

    import drawing = entityframework.components.drawing;

    /**
     * A client control that allows for selecting and creating drawables.
     */
    export class DrawableTypeControl {
        private view : framework.ViewModel<any>;
        private drawableTypePicker : controls.SelectControl<drawing.DrawableType>
        private _callback;

        constructor(view : framework.ViewModel<any>, selectId : string, callback? : Function) {
            this.view = view;
            this.drawableTypePicker = new SelectControl<drawing.DrawableType>(
                this.view,
                selectId,
                util.formatters.valuesFromEnum(drawing.DrawableType),
                drawing.DrawableType[drawing.DrawableType.Container]);
            this._callback = callback || function() {};

            this.view.registerCallback("add-drawable", callback);
        }

        set callback(callback) {
            this._callback = callback;
        }

        get pickedDrawable() : string {
            return this.drawableTypePicker.value;
        }
    }
}
