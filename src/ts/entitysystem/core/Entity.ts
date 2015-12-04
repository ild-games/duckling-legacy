module entityframework {

    import observe = framework.observe;

    export class EntityChanged extends observe.DataChangeEvent {
        constructor(name : string, object : Entity, child? : observe.DataChangeEvent) {
            super(name, object, child)
        }

        /**
         * Event describing how the entity was changed. Null if the event effects
         * more than one entity.
         */
        get componentsEvent() : observe.ObservableMapChanged<Component> {
            return <any>this.child;
        }

        /**
         * Check if the data changed event is the result of an entity being modified.
         */
        get isComponentChanged() {
            return this.componentsEvent;
        }

        /**
         * Check if the data changed event is the result of an entity being removed.
         */
        get isComponentRemoved() {
            return this.componentsEvent && this.componentsEvent.isItemRemoved;
        }

        /**
         * Check if the data changed event is the result of an entity being added.
         */
        get isComponentAdded() {
            return this.componentsEvent && this.componentsEvent.isItemAdded;
        }
    }

    /**
     * Contains a collection of components and the meta data about them.
     */
    export class Entity extends framework.observe.Observable<EntityChanged> {
        private components : observe.ObservableMap<Component>;

        /**
         * Construct an empty entity.
         */
        constructor() {
            super();
            this.components = new framework.observe.ObservableMap<Component>();
            this.components.addChangeListener((event) => {
                this.publishDataChanged(new EntityChanged("components", this, event));
            });
        }

        /**
         * Add a component to the entity.
         * @param name Name of the component.
         * @param component Object containing the component's data.
         * @returns Null if the component is new, otherwise it returns
         * the component that is being replaced.
         */
        addComponent(name : string, component : Component) : Component {
            return this.components.put(name, component);
        }

        /**
         * Remove a component from the Entity
         * @param name Name of the component to remove.
         * @returns The component if it exists, otherwise null.
         */
        removeComponent(name : string) : Component {
            return this.components.remove(name);
        }

        /**
         * Return the component if the entity has one.
         * @param name The name of the component type.
         */
        getComponent<T extends Component>(name : string) : T {
            return <T>this.components.get(name);
        }

        /**
         * Iterate over the components attached to the entity.
         * @param func Function that is called for each component.  The first argument
         * is the component and the second argument is the component's key.
         */
        forEach(func : (component : Component, key : string) => void) {
            this.components.forEach(func);
        }
    }
}
