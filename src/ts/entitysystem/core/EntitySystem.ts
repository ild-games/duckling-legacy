///<reference path="../../framework/observe/Observable.ts"/>

module entityframework
{

    import observe = framework.observe;

    const EVENT_MOVED = "Moved";

    export class EntitySystemChanged extends observe.DataChangeEvent {
        constructor(name : string, object : EntitySystem, child? : observe.DataChangeEvent) {
            super(name, object, child)
        }

        /**
         * Event describing how the entity was changed. Null if the event effects
         * more than one entity.
         */
        get entitiesEvent() : observe.ObservableMapChanged<Entity> {
            return <any>this.child;
        }

        /**
         * Check if the data changed event is the result of an entity being modified.
         */
        get isEntityChanged() {
            return this.entitiesEvent;
        }

        /**
         * Check if the data changed event is the result of an entity being removed.
         */
        get isEntityRemoved() {
            return this.entitiesEvent && this.entitiesEvent.isItemRemoved;
        }

        /**
         * Check if the data changed event is the result of an entity being added.
         */
        get isEntityAdded() {
            return this.entitiesEvent && this.entitiesEvent.isItemRemoved;
        }

        /**
         * Check if the data changed event is the result of an entity system being moved
         * into this system.
         */
        get isSystemMoved() {
            return this.name === EVENT_MOVED;
        }
    }

    /**
     * Contains a collection of Entities and other meta data about them.
     */
    @framework.ContextKey("entityframework.EntitySystem")
    export class EntitySystem extends framework.observe.Observable<EntitySystemChanged>
    {
        private entities : framework.observe.ObservableMap<Entity>;
        private componentFactories : {[key:string]:ComponentFactory} = {};
        private nextId : number = 0;
        private entityCallback : observe.DataChangeCallback<observe.ObservableMapChanged<Entity>>;

        /**
         * Create an empty EntitySystem
         */
        constructor() {
            super();
            this.entityCallback = (event) => {
                this.publishDataChanged(new EntitySystemChanged("entities",this, event));
            };
            this.setEntities(new framework.observe.ObservableMap<Entity>());
        }

        /**
         * Add a component type to the entity system.
         * @param factory Factory that creates objects needed to support the component type.
         */
        addComponentType(factory : ComponentFactory) {
            this.componentFactories[factory.name] = factory;
        }

        /**
         * Add a component of the given type the entity.
         * @param entityName Name of the entity the component is being added to.
         * @param componentTypeName Type of the component to add.
         */
        addComponent(entityName : string, componentTypeName : string) {
            var component = this.componentFactories[componentTypeName].createComponent();
            this.getEntity(entityName).addComponent(componentTypeName, component);
        }

        /**
         * Create an empty Entity and add it to the system.
         * @param name The name of the entity.
         * @returns The new entity.
         */
        createEntity(name : string) {
            var entity = new Entity();
            this.entities.put(name, entity);
            return entity;
        }

        /**
         * Remove an Entity from the system.
         * @param name The name of the entity to remove.
         * @returns The entity removed from the system.
         */
        removeEntity(name : string) {
            return this.entities.remove(name);
        }

        /**
         * Get the entity if it exists.  Otherwise
         * return null.
         * @param name Name of the entity.
         * @returns {any|null}
         */
        getEntity(name : string) : Entity {
            return this.entities.get(name) || null;
        }

        /**
         * Add the entity to the system.
         * @param name The name of the Entity.
         * @param entity The Entity being added.
         * @returns The entity that previosly had the name.  Null
         * if no such entity existed.
         */
        addEntity(name : string, entity : Entity) {
            return this.entities.put(name, entity);
        }

        /**
         * Iterate over all of the entities in the system.
         * @param func Function that will be called for each entity.
         */
        forEach(func : (entity : Entity, key? : string) => void) {
            this.entities.forEach(func);
        }

        /**
         * Iterate over the component factory for each type of component in the Entity system.
         * @param func Func that is called on each component.
         */
        forEachType(func : (factory : ComponentFactory, key? : string) => void) {
            for(var key in this.componentFactories) {
                func(this.componentFactories[key], key);
            }
        }

        /**
         * Generates the next available unique key for the entity system.
         */
        nextKey() {
            return ++this.nextId + "";
        }

        /**
         * Set the number that can be used to generate unique identifiers.
         * @param next Number that will be used as the next ID.
         */
        seedNextKey(next : number) {
            this.nextId = next;
        }


        /**
         * Get an empty clone of the EntitySystem.  The clone will have all of the
         * same system, but it will contain no components or entities.
         * @returns A new empty EntitySystem.
         */
        getEmptyClone() {
            var clone = new EntitySystem();
            for(var key in this.componentFactories) {
                clone.addComponentType(this.componentFactories[key])
            }
            return clone;
        }

        /**
         * Get the factory for a given component.
         * @param componentName Name of the component to get the factory for.
         * @returns The factory used to create new instances of the component.
         */
        getComponentFactory(componentName : string) {
            return this.componentFactories[componentName];
        }

        /**
         * Move the contents of the argument entity system into this system.  After
         * the move the argument entity system should not be used.
         * @param entitySystem
         */
        move(entitySystem : EntitySystem) {
            this.componentFactories = entitySystem.componentFactories;
            this.setEntities(entitySystem.entities);
            this.nextId = entitySystem.nextId;
            this.publishDataChanged(new EntitySystemChanged(EVENT_MOVED, this));
        }

        collectAssets() : Array<entityframework.map.Asset> {
            var allAssets = {};
            this.forEach((entity) => {
                entity.forEach((component) => {
                    component.collectAssets().forEach((asset : entityframework.map.Asset) => {
                        if (!allAssets[asset.type]) {
                            allAssets[asset.type] = {};
                        }
                        allAssets[asset.type][asset.key] = true;
                    });
                });
            });
            var assetsArray : Array<entityframework.map.Asset> = [];
            for (var assetType in allAssets) {
                for (var assetKey in allAssets[assetType]) {
                    assetsArray.push(new entityframework.map.GenericAsset(assetType, assetKey));
                }
            }
            return assetsArray;
        }

        private setEntities(entities : observe.ObservableMap<Entity>) {
            if (this.entities) {
                this.entities.removeChangeListener(this.entityCallback);
            }

            this.entities = entities;

            if (this.entities) {
                this.entities.addChangeListener(this.entityCallback);
            }
        }
    }
}
