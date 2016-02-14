import ViewModel from './ViewModel';

interface VMFactory {
    /**
    * Create a ViewModel that represents a form
    */
    createFormVM() : ViewModel<any>;
}
export default VMFactory;
