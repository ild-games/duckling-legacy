module controls {
    export class ColorPickerControl {
        private id : string = "";
        private view : framework.ViewModel<any>;
        private jQueryColorPicker;
        private jQueryInputTag;

        constructor(view : framework.ViewModel<any>, id : string) {
            this.id = id;
            this.view = view;
            this.jQueryColorPicker = $(view.findById(id));
            this.jQueryInputTag = $(view.findById(id + "_inputTag"));

            this.init();
        }

        private init() {
            this.jQueryColorPicker.colorpicker({
                format: 'rgba',
                component: $(this.view.findById(this.id + "_component"))
            })
            this.jQueryColorPicker.on("changeColor.colorpicker", (event) => this.onColorChange());
        }

        private onColorChange() {
            this.jQueryInputTag.trigger("input");
        }
    }
}
