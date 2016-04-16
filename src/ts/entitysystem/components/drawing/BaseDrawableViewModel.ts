import RivetsViewModel from '../../../framework/RivetsViewModel';
/**
* Base RivetsViewModel for all used by all Drawable RivetsViewModels.
*/
export default class BaseDrawableViewModel<T> extends RivetsViewModel<T> {
    isWhite : boolean = true;
}
