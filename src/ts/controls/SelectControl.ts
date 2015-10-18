module controls {
    /**
      * Class used to abstract interaction with the jquery select control.
      */
    export class SelectControl<T> {
        private view : framework.ViewModel<any>;;
        private _values : {[s:string]:T};
        private selectJqueryObject;
        private selectElement : HTMLSelectElement;
        private pendingUpdate : boolean = false;
        private _callback;

        constructor(view : framework.ViewModel<any>,
                id : string,
                values : {[s : string] : T},
                defaultValue : string = null) {
            var element = view.findById(id);
            this.view = view;
            this.selectJqueryObject = $(element);
            this.selectElement = <HTMLSelectElement>element;

            this.init();

            this.values = values;
            this.value = defaultValue;

            this.selectJqueryObject.on("change", (event) => this.onChange(event));
        }

        set callback(callback) {
            this._callback = callback;
        }

        get value() : string {
            return this.selectElement.value;
        }

        set value(nextVal : string) {
            this.selectJqueryObject.selectpicker('val', nextVal);;
            //this.selectElement.value = nextVal;;
        }

        set values(nextValues : {[s : string] : T}) {
            this._values = nextValues;
            this.selectElement.innerHTML = this.createInnerHTML(Object.keys(nextValues));

            if (!(this.value in this._values)) {
                this.selectJqueryObject.selectpicker('deselectAll');
            }

            this.update();
        }

        private onChange(event) {
            var selected = this._values[this.selectElement.value];;
            if (selected !== undefined && this._callback) {
                this._callback(selected);
            }
        }

        private createInnerHTML(options : string[]) {
            return this.view.renderTemplate("controls/select_contents", {keys : options});
        }

        private init() {
            this.selectJqueryObject.selectpicker();
        }

        private update() {
            this.selectJqueryObject.selectpicker('refresh');
        }
    }
}
