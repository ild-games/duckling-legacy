import Command from '../../framework/command/Command';
import Context from '../../framework/context/Context';
import RivetsViewModel from '../../framework/RivetsViewModel';
import ViewModel from '../../framework/ViewModel';
import ListAdapter from '../../framework/listvm/ListAdapter';
import ListVM from '../../framework/listvm/ListVM';
import SelectControl from '../../controls/SelectControl';
import Component from '../core/Component';
import ComponentFactory from '../core/ComponentFactory';
import {EntitySystemChanged, EntitySystem} from '../core/EntitySystem';
import {EntityChanged, Entity} from '../core/Entity';
import SelectedEntity from '../core/SelectedEntity';

interface ComponentType {
    data : Component;
    name : string;
    displayName : string;
    vm : ViewModel<any>;
}

export class EntityEditorVM extends RivetsViewModel<EntitySystem> implements ListAdapter<Component> {
    //Field that exist for rivets bindings
    private _currentEntityName : string = "Select Entity";
    private _currentEntity : Entity;
    private _entityNames : Array<string> = [];
    private _componentsNotOnEntity : Array<string> = [];
    private _components : ComponentType[] = [];
    private _adapter : ListAdapter<Component>;
    private _selectedEntity : SelectedEntity;
    private _listVM : ListVM;

    //References to controls
    private selectedEntityPicker : SelectControl<String>;
    private addComponentPicker : SelectControl<String>;

    constructor() {
        super();
        this._adapter = this;
        this.registerCallback("add-component", this.addComponentFromSelect);
        this.registerCallback("delete-entity", this.deleteEntity);
    }

    onDataReady() {
        this._listVM = new ListVM("entityeditor/componentwrapper");
        this.addChildView("entity-form-list", this._listVM , this._adapter);
        this.onSystemChange(null);
        this._selectedEntity = this._context.getSharedObjectByKey("selectedEntity");

        this.setChangeListener(this._selectedEntity,() => {
            this.selectEntity(this._selectedEntity.entityKey);
        });

        this.setChangeListener(this.data, (event) => {
            this.onSystemChange(event);
        });
    }

    onViewReady() {
        super.onViewReady();
        this.selectedEntityPicker = new SelectControl<String>(this, "entityNames", this.getEntities(), "");
        this.selectedEntityPicker.callback = () => this._selectedEntity.entityKey = this.selectedEntityPicker.value;
        this.addComponentPicker = new SelectControl<String>(this, "componentsToAddPicker",{},"");
    }

    private deleteEntity() {
        this._context.commandQueue.pushCommand(
            new DeleteEntityCommand(this.data, this, this._selectedEntity.entityKey, this._currentEntity));
    }

    addComponentFromSelect() {
        var pickerVal = this.addComponentPicker.value;
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

        this.onComponentsChanged();
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

        this.onComponentsChanged();
    }

    getItemVM(index:number) {
        var info = this._components[index];
        info.vm.setData(this._context, this._currentEntity.getComponent(info.name));
        return info.vm;
    }

    getItem(index:number) {
        return this._currentEntity.getComponent(this._components[index].name);
    }

    getItemExtras(index : number) : any {
        return this._components[index];
    }

    selectEntity(name : string) {
        this._components = [];
        this._componentsNotOnEntity = [];


        if (name && name !== "") {
            this.selectedEntityPicker.value = name;
            if (this._currentEntity) {
                this.removeChangeListener(this._currentEntity);
            }

            this._currentEntity = this.data.getEntity(name);
            this._currentEntityName = name;
            this.setChangeListener(this._currentEntity, (event) => {
                this.onEntityChange(event);
            });

            this.data.forEachType((factory : ComponentFactory, type : string) => {
                this._componentsNotOnEntity.push(type);
                if (this._currentEntity.getComponent(type)) {
                    this.constructVMComponent(type, factory);
                }
            });
        }

        this.onComponentsChanged();
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

    onSystemChange(event : EntitySystemChanged) {
        this._entityNames = [];
        this.data.forEach((entity : Entity, key : string) => {
            this._entityNames.push(key);
        });

        var shouldUpdatePicker = !event
            || event.isEntityAdded
            || event.isEntityRemoved
            || event.isSystemMoved;

        if (this.selectedEntityPicker && shouldUpdatePicker) {
            this.selectedEntityPicker.values = this.getEntities();
        }
    }

    onEntityChange(event : EntityChanged) {
        if (event.isComponentAdded) {
            this.reflectAddedComponents();
        }

        if (event.isComponentRemoved) {
            this.reflectRemovedComponents();
        }
    }

    private getEntities() : {[s : string] : string} {
        var entities : {[s : string] : string} = {};
        this.data.forEach((entity, key) => entities[key] = key);
        return entities;
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

    get isDeleteEntityEnabled() : boolean {
        return this._selectedEntity && this._selectedEntity.entityKey !== "";
    }

    private onComponentsChanged() {
        this._listVM.dataChanged();
        this.setupCloseComponentHandlers();

        if (this.addComponentPicker) {
            var values : {[s:string]:string} = {};
            this._componentsNotOnEntity.forEach((name) => values[name] = name);
            this.addComponentPicker.values = values;
        }
    }
}

class RemoveComponentCommand implements Command {
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

class AddComponentCommand implements Command {
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

export class AddEntityCommand implements Command {
    private es : EntitySystem;
    private entity : Entity;
    private entityId : string;
    private context : Context;

    constructor(entity : Entity, context : Context) {
        this.es = context.getSharedObject(EntitySystem);
        this.entity = entity;
        this.context = context;
        this.entityId = this.es.nextKey();
    }

    execute() {
        this.es.addEntity(this.entityId, this.entity);
        var selectedEntity = this.context.getSharedObjectByKey("selectedEntity");
        selectedEntity.entityKey = this.entityId;
        this.context.setSharedObjectByKey("selectedEntity", selectedEntity);
    }

    undo() {
        this.es.removeEntity(this.entityId);
        var selectedEntity = this.context.getSharedObjectByKey("selectedEntity");
        selectedEntity.entityKey = "";
        this.context.setSharedObjectByKey("selectedEntity", selectedEntity);
    }
}

class DeleteEntityCommand implements Command {
    private entitySystem : EntitySystem;
    private entityEditorVM : EntityEditorVM;
    private entityKey : string;
    private entityToDelete : Entity;

    constructor(entitySystem : EntitySystem, entityEditorVM : EntityEditorVM, entityKey : string, entityToDelete : Entity) {
        this.entitySystem = entitySystem;
        this.entityEditorVM = entityEditorVM;
        this.entityKey = entityKey;
        this.entityToDelete = entityToDelete;
    }

    execute() {
        this.entityEditorVM.selectEntity("");
        this.entitySystem.removeEntity(this.entityKey);
    }

    undo() {
        this.entitySystem.addEntity(this.entityKey, this.entityToDelete);
        this.entityEditorVM.selectEntity(this.entityKey);
    }

}
