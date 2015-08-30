module entityframework {

    import observe = framework.observe;

    /**
     * Contains a collection of components and the meta data about them.
     */
    export class Entity extends framework.observe.Observable {
        @observe.Object()
        private components : framework.observe.ObservableMap<Component>;

        /**
         * Construct an empty entity.
         */
        constructor() {
            super();
            this.components = new framework.observe.ObservableMap<Component>();
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