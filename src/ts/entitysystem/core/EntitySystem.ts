///<reference path="../../framework/observe/Observable.ts"/>

module entityframework
{
    /**
     * Contains a collection of Entities and other meta data about them.
     */
    export class EntitySystem extends framework.observe.Observable
    {
        private _entities : framework.observe.ObservableMap<Entity>;
        private _componentFactories : {[key:string]:ComponentFactory} = {};
        private _nextId : number = 0;

        /**
         * Create an empty EntitySystem
         */
        constructor() {
            super();
            this._entities = new framework.observe.ObservableMap<Entity>();
            this._entities.listenForChanges("Entities", this);
        }

        /**
         * Add a component type to the entity system.
         * @param factory Factory that creates objects needed to support the component type.
         */
        addComponentType(factory : ComponentFactory) {
            this._componentFactories[factory.name] = factory;
        }

        /**
         * Add a component of the given type the entity.
         * @param entityName Name of the entity the component is being added to.
         * @param componentTypeName Type of the component to add.
         */
        addComponent(entityName : string, componentTypeName : string) {
            var component = this._componentFactories[componentTypeName].createComponent();
            this.getEntity(entityName).addComponent(componentTypeName, component);
        }

        /**
         * Create an empty Entity and add it to the system.
         * @param name The name of the entity.
         * @returns The new entity.
         */
        createEntity(name : string) {
            var entity = new Entity();
            this._entities.put(name, entity);
            return entity;
        }

        /**
         * Remove an Entity from the system.
         * @param name The name of the entity to remove.
         * @returns The entity removed from the system.
         */
        removeEntity(name : string) {
            return this._entities.remove(name);
        }

        /**
         * Get the entity if it exists.  Otherwise
         * return null.
         * @param name Name of the entity.
         * @returns {any|null}
         */
        getEntity(name : string) : Entity {
            return this._entities.get(name) || null;
        }

        /**
         * Add the entity to the system.
         * @param name The name of the Entity.
         * @param entity The Entity being added.
         * @returns The entity that previosly had the name.  Null
         * if no such entity existed.
         */
        addEntity(name : string, entity : Entity) {
            return this._entities.put(name, entity);
        }

        /**
         * Iterate over all of the entities in the system.
         * @param func Function that will be called for each entity.
         */
        forEach(func : (entity : Entity, key? : string) => void) {
            this._entities.forEach(func);
        }

        /**
         * Iterate over the component factory for each type of component in the Entity system.
         * @param func Func that is called on each component.
         */
        forEachType(func : (factory : ComponentFactory, key? : string) => void) {
            for(var key in this._componentFactories) {
                func(this._componentFactories[key], key);
            }
        }

        /**
         * Generates the next available unique key for the entity system.
         */
        nextKey() {
            return ++this._nextId + "";
        }

        /**
         * Set the number that can be used to generate unique identifiers.
         * @param next Number that will be used as the next ID.
         */
        seedNextKey(next : number) {
            this._nextId = next;
        }


        /**
         * Get an empty clone of the EntitySystem.  The clone will have all of the
         * same system, but it will contain no components or entities.
         * @returns A new empty EntitySystem.
         */
        getEmptyClone() {
            var clone = new EntitySystem();
            for(var key in this._componentFactories) {
                clone.addComponentType(this._componentFactories[key])
            }
            return clone;
        }

        /**
         * Move the contents of the argument entity system into this system.  After
         * the move the argument entity system should not be used.
         * @param entitySystem
         */
        move(entitySystem : EntitySystem) {
            this._entities.stopListening("Entities", this);
            entitySystem._entities.stopListening("Entities", entitySystem);

            this._componentFactories = entitySystem._componentFactories;
            this._entities = entitySystem._entities;
            this._nextId = entitySystem._nextId;

            this._entities.listenForChanges("Entities", this);

            this.dataChanged("replaced", null);
        }
    }
}
