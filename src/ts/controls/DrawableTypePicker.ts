module controls {
    export class DrawableTypePicker {
        private view : framework.ViewModel<any>;
        private divJQueryObject;

        constructor(view : framework.ViewModel<any>, id : string) {
            var element = view.findById(id);
            this.view = view;
            this.divJQueryObject = $(element);
        }
    }
}
