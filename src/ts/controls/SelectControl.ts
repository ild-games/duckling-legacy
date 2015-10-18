module controls {
    /**
      * Class used to abstract interaction with the jquery select control.
      */
    export class SelectControl {
        private selectJqueryObject;
        private selectElement : HTMLSelectElement;
        private pendingUpdate : boolean = false;

        constructor(element : HTMLElement) {
            this.selectJqueryObject = $(element);
            this.selectElement = <HTMLSelectElement>element;
            this.init();
        }

        init() {
            this.selectJqueryObject.selectpicker();
        }

        update() {
            if (!this.pendingUpdate) {
                this.pendingUpdate = true;
                setTimeout(() => {
                    this.pendingUpdate = false;
                    this.selectJqueryObject.selectpicker('refresh');
                });
            }
        }

        get value() : string {
            return this.selectElement.value;
        }

        set value(nextVal : string) {
            this.selectJqueryObject.selectpicker('val', nextVal);;
        }
    }
}
