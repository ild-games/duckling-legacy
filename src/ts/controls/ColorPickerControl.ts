module controls {
    export class ColorPickerControl {
        private view : framework.ViewModel<any>;
        private jQueryObject;

        constructor(view : framework.ViewModel<any>, id : string) {
            var element = view.findById(id);
            this.view = view;
            this.jQueryObject = $(element);

            this.init();
        }

        private init() {
            this.jQueryObject.colorpicker({
                format: 'rgba'
            });
        }
    }
}
