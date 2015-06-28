module entityframework {
    /**
     * Contains a collection of components and the meta data about them.
     */
    export class Entity extends framework.observe.Observable {
        private _components : framework.observe.ObservableMap<Component>;

        /**
         * Construct an empty entity.
         */
        constructor() {
            super();
            this._components = new framework.observe.ObservableMap<Component>();
            this._components.listenForChanges("Components", this);
        }

        /**
         * Add a component to the entity.
         * @param name Name of the component.
         * @param component Object containing the component's data.
         * @returns Null if the component is new, otherwise it returns
         * the component that is being replaced.
         */
        addComponent(name : string, component : Component) : Component {
            return this._components.put(name, component);
        }

        /**
         * Remove a component from the Entity
         * @param name Name of the component to remove.
         * @returns The component if it exists, otherwise null.
         */
        removeComponent(name : string) : Component {
            return this._components.remove(name);
        }

        /**
         * Return the component if the entity has one.
         * @param name The name of the component type.
         */
        getComponent(name : string) : Component {
            return this._components.get(name);
        }
    }
}