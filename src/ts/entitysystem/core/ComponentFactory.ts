module entityframework {
    /**
     * Interface for factories that create all of the objects needed for generically
     * interacting with components.
     */
    export interface ComponentFactory extends framework.VMFactory {
        name : string;
        displayName : string;

        /**
         * Property with the component's constructor.  Used during the serialization process.
         */
        componentConstructor? : Function;

        /**
         * Create a new instance of the component.
         */
        createComponent() : Component;
    }
}
