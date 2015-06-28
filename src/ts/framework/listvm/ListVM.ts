///<reference path="../ViewModel.ts"/>
module framework.listvm {
    export class ListVM extends ViewModel {
        private _ids : string[];
        private _nextID : number = 0;
        private _adapter : ListAdapter;

        get ids() : string[] {
            if (!this._ids) {
                this._ids = [];
                for(var i = 0; i < this._adapter.length; i++) {
                   this._ids.push(this.id("element-" + this._nextID++));
                }
            }
            return this._ids;
        }

        onReady() {
            this._ids.forEach((id : string, index : number) => {
                this._adapter.renderItem(index, this.findById(id));
            });
        }

        detach() {
            this._ids.forEach((id : string, index : number) => {
                this._adapter.detachItem(index, this.findById(id));
            });
            super.detach();
        }
    }
}
