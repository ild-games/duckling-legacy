///<reference path="../ViewModel.ts"/>
module framework.listvm {

    /**
     * ViewModel that can be used to render a list of complex items. Each item
     * will get its own ViewModel.  Consumers of ListVM should implement the
     * ListAdapter<T> interface.
     */
    export class ListVM extends ViewModel<ListAdapter<any>> {
        private _ids : string[];
        private _nextID : number = 0;
        private _itemTemplate :string = null;

        /**
         * Construct an instance of the ListVM.
         * @param itemTemplate String describing the template that should be used
         * to surround the child item. The template, when rendered, is provided with
         * a local "id" variable. The html element with the id set to the "id" variable
         * will be used as the root of the child view model.
         */
        constructor(itemTemplate?) {
            super();
            this._itemTemplate = itemTemplate;
        }

        get viewFile():string {
            return "list_vm";
        }

        get ids() : string[] {
            if (!this._ids) {
                this._ids = [];
                for(var i = 0; i < this.data.length; i++) {
                   this._ids.push("element-" + this._nextID++);
                }
            }
            return this._ids;
        }

        renderItem(id : string) {
            if (this._itemTemplate) {
                return '<div class="list-element">' +
                    this.renderTemplate(this._itemTemplate, {id : this.id(id)}) +
                    "</div>";
            } else {
                return '<div id="' + this.id(id) + '"></div>';
            }
        }

        dataChanged() {
            var attached = this._attached;

            this.clearList();

            if (attached) {
                this.detach();
            }

            this.ids.forEach((id : string, index : number) => {
                var vm = this.data.getItemVM(index);
                var data = this.data.getItem(index);
                this.addChildView(id, vm, data);
            });

            if (attached) {
                this.attach(this._htmlRoot);
            }
        }

        onDataReady() {
            this.dataChanged();
        }

        onViewReady() {

        }

        clearList() {
            this.removeChildViews();
            this._ids = null;
        }

        detach() {
            super.detach();
            this.clearList();
        }
    }
}
