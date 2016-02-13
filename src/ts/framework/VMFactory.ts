import ViewModel from './ViewModel';

export interface VMFactory {
    /**
    * Create a ViewModel that represents a form
    */
    createFormVM() : ViewModel<any>;
}
