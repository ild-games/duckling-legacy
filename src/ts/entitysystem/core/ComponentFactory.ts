module entityframework {
    export interface ComponentFactory {
        name : string;
        createFormVM() : framework.ViewModel<any>;
        createComponent() : Component;
    }
}