module controls {
    /**
     * Class used to abstract interaction with the jquery select control.
     */
    export class SelectControl<T> {
        private view : framework.ViewModel<any>;
        private _values : {[s:string]:T};
        private selectJqueryObject;
        private selectElement : HTMLSelectElement;
        private pendingUpdate : boolean = false;
        private _callback;

        /**
         * Construct a SelectControl and initalize it.
         * @param view The ViewModel the control is hosted on.
         * @param id The Id of the select control in the dom.
         * @param values The keys are what are seen by the user and the values are delivered to the callback
         *              when the user makes a selection.
         * @param defaultValue The value the select control should start with.
         */
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

        /**
         * Set a callback that is called whenever the user chagnes their selection.
         */
        set callback(callback) {
            this._callback = callback;
        }

        /**
         * Get the value selected by the user.
         */
        get value() : string {
            return this.selectElement.value;
        }

        /**
         * Set the current selection of the control seen by the user.
         */
        set value(nextVal : string) {
            this.selectJqueryObject.selectpicker('val', nextVal);
        }

        /**
         * Set the values the user can select from.
         * @param nextValues A map from the string keys seen by the user to objects returned by the callback.
         */
        set values(nextValues : {[s : string] : T}) {
            this._values = nextValues;
            this.selectElement.innerHTML = this.createInnerHTML(Object.keys(nextValues));

            if (this.value && !(this.value in this._values)) {
                this.selectJqueryObject.selectpicker('deselectAll');
            }

            this.update();
        }

        private onChange(event) {
            var selected = this._values[this.selectElement.value];
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
