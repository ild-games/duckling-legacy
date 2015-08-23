///<reference path="../../framework/ViewModel.ts"/>
module entityframework
{
    interface ComponentType {
        name : string,
        vm : framework.ViewModel<any>
    }

    export class EntityEditorVM extends  framework.ViewModel<EntitySystem> implements framework.observe.Observer, framework.listvm.ListAdapter<Component> {
        //Field that exist for rivets bindings
        private _currentEntityName : string = "Select Entity";
        private _currentEntity : Entity;
        private _entityNames : Array<string> = [];
        private _components : ComponentType[] = [];
        private _adapter : framework.listvm.ListAdapter<Component>;
        private _selectedEntity : entityframework.core.SelectedEntity;
        private _listVM : framework.listvm.ListVM;

        constructor() {
            super();
            this._adapter = this;
        }

        onDataChanged(key:string, event:framework.observe.DataChangeEvent) {
            switch (key) {
                case "data":
                    this.onSystemChange(event);
                    setTimeout(() => $(this._htmlRoot).find('.selectpicker').selectpicker('refresh'));
                    break;
                case "selectedEntity":
                    this.selectEntity(this._selectedEntity.entityKey);
                    break;
            }
        }

        onDataReady() {
            this._listVM = new framework.listvm.ListVM("entityeditor/componentwrapper");
            this.addChildView("entity-form-list", this._listVM , this._adapter);
            this.onSystemChange(null);
            this._selectedEntity = this._context.getSharedObjectByKey("selectedEntity");
            this._selectedEntity.listenForChanges("selectedEntity", this);
            this.data.listenForChanges("data", this);
        }

        onViewReady() {
            super.onViewReady();
            $(this._htmlRoot).find(".selectpicker").selectpicker();
        }

        get length() {
            return this._components.length;
        }

        getItemVM(index:number) {
            var info = this._components[index];
            info.vm.setData(this._context, this._currentEntity.getComponent(info.name));
            return info.vm;
        }

        getItem(index:number) {
            return this._currentEntity.getComponent(this._components[index].name);
        }

        getComponents() {
            if (!this._currentEntity) {
                return [];
            }

            var components = [];

            this.data.forEachType(function(factory : ComponentFactory, name : String) {
                if (this._currentEntity.getComponent(name)) {
                    components.push({
                        data : this._currentEntity.getComponent(name),
                        vm : factory.createFormVM(),
                        name : name
                    });
                }
            });

            return components;
        }

        selectEntity(name : string) {
            this._currentEntity = this.data.getEntity(name);
            this._currentEntityName = name;

            this._components = [];

            if (name && name !== "") {
                this.currentEntity = this.data.getEntity(name);
                this.currentEntityName = name;

                this.data.forEachType((factory : ComponentFactory, type : string) => {
                    if (this.currentEntity.getComponent(type)) {
                        this._components.push({
                            name : type,
                            vm : factory.createFormVM()
                        });
                    }
                });
            }

            this._listVM.dataChanged();
        }

        onSystemChange(event : framework.observe.DataChangeEvent) {
            this._entityNames = [];
            this.data.forEach((entity : Entity, key : string) => {
                this._entityNames.push(key);
            });
        }

        get viewFile():string {
            return "entityeditor/entityeditor";
        }

        get currentEntityName() : string {
            return this._currentEntityName;
        }

        get entityNames() : Array<string> {
            return this._entityNames;
        }
    }
}