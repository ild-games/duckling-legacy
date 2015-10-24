module entityframework {
    /**
     * Interface for factories that create all of the objects needed for generically
     * interacting with components.
     */
    export interface ComponentFactory extends framework.VMFactory {
        name : string;
        displayName : string;

        /**
         * Property that is used to determine if the component is polymorphic.  Should
         * only be used for falsy/truey checks.
         */
        isPolymorphic? : boolean;

        /**
         * Create a new instance of the component.
         */
        createComponent() : Component;
    }
}
