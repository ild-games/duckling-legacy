///<reference path="../../framework/ViewModel.ts"/>
module entityframework
{
    interface ComponentType {
        name : string,
        vm : framework.ViewModel<any>
    }

    export class EntityEditorVM extends  framework.ViewModel<EntitySystem> implements framework.observe.Observer, framework.listvm.ListAdapter {
        //Field that exist for rivets bindings
        private currentEntityName : string = "Select Entity";
        private currentEntity : Entity;
        private entityNames : string[];
        private _components : ComponentType[];
        private adapter : framework.listvm.ListAdapter;

        constructor() {
            super();
            this.adapter = this;
        }

        onDataChanged(key:string, event:framework.observe.DataChangeEvent) {
            switch (key) {
                case "data":
                    this.onSystemChange(event);
                    break;
            }
        }

        onReady() {
            super.onReady();

            var name = "Physics";

            this.data.createEntity("test1");
            this.data.createEntity("test2");
            this.data.createEntity("test3");
            this.data.createEntity("test4");

            this.data.addComponent("test1", name);
            this.data.addComponent("test2", name);
            this.data.addComponent("test3", name);

            this.data.listenForChanges("data", this)
            this.onSystemChange(null);
            this.selectEntity("test1");
        }

        get length() {
            return this._components.length;
        }

        renderItem(index:number, root:HTMLElement) {
            var info = this._components[index];
            info.vm.init(this._context, root, this.currentEntity.getComponent(info.name));
        }

        detachItem(index:number, root:HTMLElement) {
            this._components[index].vm.detach();
        }

        getComponents() {
            if (!this.currentEntity) {
                return [];
            }

            var components = [];

            this.data.forEachType(function(factory : ComponentFactory, name : String) {
                if (this.currentEntity.getComponent(name)) {
                    components.push({
                        data : this.currentEntity.getComponent(name),
                        vm : factory.createFormVM()
                    });
                }
            });

            return components;
        }

        selectEntity(name : string) {
            this.currentEntity = this.data.getEntity(name);
            this.currentEntityName = name;

            this._components = [];
            this.data.forEachType((factory : ComponentFactory, type : string) => {
                this._components.push({
                    name : type,
                    vm : factory.createFormVM()
                });
            })
        }

        onSystemChange(event : framework.observe.DataChangeEvent) {
            this.entityNames = [];
            this.data.forEach((entity : Entity, key : string) => {
                this.entityNames.push(key);
            });
        }

        get viewFile():string {
            return "entityeditor";
        }
    }
}