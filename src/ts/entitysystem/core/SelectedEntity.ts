module entityframework.core {

    import observe = framework.observe;

    /**
     * Object designed to be used as a shared object on the context.  It represents
     * the entity that is currently being worked on.  ViewModels should listen to
     * the object in order to show data related to the entity currently selected
     * by the user.
     */
    export class SelectedEntity extends framework.observe.Observable {
        @observe.Primitive()
        entityKey : string;
    }
}