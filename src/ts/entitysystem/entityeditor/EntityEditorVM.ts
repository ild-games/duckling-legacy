///<reference path="../../framework/ViewModel.ts"/>
module entityframework
{
    interface ComponentType {
        name : string;
        displayName : string;
        vm : framework.ViewModel<any>;
    }

    export class EntityEditorVM extends  framework.ViewModel<EntitySystem> implements framework.observe.Observer, framework.listvm.ListAdapter<Component> {
        //Field that exist for rivets bindings
        private _currentEntityName : string = "Select Entity";
        private _currentEntity : Entity;
        private _entityNames : Array<string> = [];
        private _componentsNotOnEntity : Array<string> = [];
        private _components : ComponentType[] = [];
        private _adapter : framework.listvm.ListAdapter<Component>;
        private _selectedEntity : entityframework.core.SelectedEntity;
        private _listVM : framework.listvm.ListVM;
        private _addComponentPicker : HTMLSelectElement;

        constructor() {
            super();
            this._adapter = this;
            this.registerCallback("add-component", this.addComponentFromSelect);
        }

        onDataChanged(key:string, event:framework.observe.DataChangeEvent) {
            setTimeout(() => $(this._htmlRoot).find('.selectpicker').selectpicker('refresh'));
            switch (key) {
                case "data":
                    this.onSystemChange(event);
                    break;
                case "selectedEntity":
                    this.selectEntity(this._selectedEntity.entityKey);
                    break;
                case "currentEntity":
                    if (event.data.key === "components") {
                        if (event.child.name === "Removed") {
                            this.reflectRemovedComponents();
                        }
                        else if (event.child.name === "Added") {
                            this.reflectAddedComponents();
                        }
                    }
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
            this._addComponentPicker = <HTMLSelectElement>this.findById("componentsToAddPicker");
        }

        addComponentFromSelect() {
            var pickerVal = this._addComponentPicker.value;
            if (pickerVal && this._currentEntity) {
                this._context.commandQueue.pushCommand(new AddComponentCommand(
                    this._currentEntity,
                    pickerVal,
                    this.data.getComponentFactory(pickerVal)));
            }
        }

        reflectAddedComponents() {
            this.data.forEachType((factory, name) => {
                if (this._currentEntity.getComponent(name)) {
                    var compInList = this._components.some((obj) => obj.name === name);
                    if (!compInList) {
                        this.constructVMComponent(name, factory);
                    }
                }
            });
            this._listVM.dataChanged();
            this.setupCloseComponentHandlers();
        }

        reflectRemovedComponents() {
            var compsToRemove = [];
            this._components.forEach((element, index) => {
                if (!this._currentEntity.getComponent(element.name)) {
                    compsToRemove.push(index);
                }
            });

            for (var i = compsToRemove.length - 1; i >= 0; i--) {
                this._componentsNotOnEntity.push(this._components[compsToRemove[i]].name);
                this._components.splice(compsToRemove[i], 1);
            }
            this._listVM.dataChanged();
            this.setupCloseComponentHandlers();
        }

        getItemVM(index:number) {
            var info = this._components[index];
            info.vm.setData(this._context, this._currentEntity.getComponent(info.name));
            return info.vm;
        }

        getItem(index:number) {
            return this._currentEntity.getComponent(this._components[index].name);
        }

        getItemExtras(index : number) {
            return this._components[index];
        }

        selectEntity(name : string) {
            this._components = [];
            this._componentsNotOnEntity = [];

            if (name && name !== "") {
                this._currentEntity = this.data.getEntity(name);
                this._currentEntityName = name;
                this._currentEntity.listenForChanges("currentEntity", this);

                this.data.forEachType((factory : ComponentFactory, type : string) => {
                    this._componentsNotOnEntity.push(type);
                    if (this._currentEntity.getComponent(type)) {
                        this.constructVMComponent(type, factory);
                    }
                });
            }

            this._listVM.dataChanged();
            this.setupCloseComponentHandlers();
        }

        constructVMComponent(name : string, factory : ComponentFactory) {
            this._components.push({
                data: this._currentEntity.getComponent(name),
                displayName: factory.displayName,
                name : name,
                vm : factory.createFormVM()
            });
            this._componentsNotOnEntity.splice(this.componentsNotOnEntity.indexOf(name), 1);
        }

        setupCloseComponentHandlers() {
            this._listVM.ids.forEach((id : string, index : number) => {
                var closeId = this._listVM.id(id) + "-close";
                $("#" + closeId).click(() => {
                    this.removeSelectEntityComponent(index);
                });
            });
        }

        removeSelectEntityComponent(index : number) {
            var removedCompName = this._components[index].name;
            this._context.commandQueue.pushCommand(
                new RemoveComponentCommand(this._currentEntity, removedCompName));
        }

        onSystemChange(event : framework.observe.DataChangeEvent) {
            this._entityNames = [];
            this.data.forEach((entity : Entity, key : string) => {
                this._entityNames.push(key);
            });
        }

        get length() {
            return this._components.length;
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

        get componentsNotOnEntity() : Array<string> {
            return this._componentsNotOnEntity;
        }

        get isAddComponentEnabled() : boolean {
            return this._componentsNotOnEntity.length > 0;
        }
    }

    class RemoveComponentCommand implements framework.command.Command {
        private _entity : Entity;
        private _componentName : string;
        private _removedComponent;

        constructor(entity : Entity, componentName : string) {
            this._entity = entity;
            this._componentName = componentName;
        }

        execute() {
            this._removedComponent = this._entity.getComponent(this._componentName);
            this._entity.removeComponent(this._componentName);
        }

        undo() {
            this._entity.addComponent(this._componentName, this._removedComponent);
        }
    }

    class AddComponentCommand implements framework.command.Command {
        private _entity: Entity;
        private _componentFactory: ComponentFactory;
        private _componentName: string;

        constructor(entity : Entity, componentName : string, componentFactory : ComponentFactory) {
            this._entity = entity;
            this._componentName = componentName;
            this._componentFactory = componentFactory;
        }

        execute() {
            this._entity.addComponent(this._componentName, this._componentFactory.createComponent());
        }

        undo() {
            this._entity.removeComponent(this._componentName);
        }
    }
}