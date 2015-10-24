module framework {
    export interface VMFactory {
        /**
         * Create a ViewModel that represents a form
         */
        createFormVM() : framework.ViewModel<any>;
    }
}
