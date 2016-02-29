import RivetsViewModel from '../RivetsViewModel';
import ListAdapter from './ListAdapter';

/**
 * RivetsViewModel that can be used to render a list of complex items. Each item
 * will get its own RivetsViewModel.  Consumers of ListVM should implement the
 * ListAdapter<T> interface.
 */
export default class ListVM extends RivetsViewModel<ListAdapter<any>> {
    private _ids : string[];
    private _indexes : {[id:string] : number};
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
            var id;
            this._ids = [];
            this._indexes = {};
            for(var i = 0; i < this.data.length; i++) {
                id = "element-" + this._nextID++;
                this._indexes[id] = i;
                this._ids.push(id);
            }
        }
        return this._ids;
    }

    renderItem(id : string) {
        if (this._itemTemplate) {
            return '<div class="list-element">' +
                this.renderTemplate(this._itemTemplate,
                    {
                        id : this.id(id),
                        extras : this.getExtras(id)
                    }) +
                '</div>';
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

    private getIndex(id : string) {
        return this._indexes[id];
    }

    private getExtras(id : string) {
        if (this.data.getItemExtras) {
            return this.data.getItemExtras(this.getIndex(id));
        } else {
            return null;
        }
    }
}
