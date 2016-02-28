import SimpleObservable from '../../framework/observe/SimpleObservable';
import {ObservePrimitive} from '../../framework/observe/ObserveDecorators';

/**
* Object designed to be used as a shared object on the context.  It represents
* the entity that is currently being worked on.  ViewModels should listen to
* the object in order to show data related to the entity currently selected
* by the user.
*/
export default class SelectedEntity extends SimpleObservable {
    @ObservePrimitive()
    entityKey : string;
}
