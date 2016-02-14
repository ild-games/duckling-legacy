import ViewModel from '../../../framework/ViewModel';
/**
* Base ViewModel for all used by all Drawable ViewModels.
*/
export default class BaseDrawableViewModel<T> extends ViewModel<T> {
    isWhite : boolean = true;
}
