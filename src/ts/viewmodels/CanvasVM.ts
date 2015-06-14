module viewmodels {
    /**
     * ViewModel for the main canvas used to interact with entities.
     */
    export class CanvasVM extends framework.ViewModel {
        constructor() {
            super();
            this.registerCallback("test", this.testCallback);
        }

        testCallback(event, argument) {
            this._context.Window.alert(argument);
        }

        /**
         * @see ViewModel.viewFile
         */
        get viewFile() : string {
            return "canvas";
        }
    }
}