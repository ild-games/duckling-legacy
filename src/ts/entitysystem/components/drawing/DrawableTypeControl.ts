import ViewModel from '../../../framework/ViewModel';
import SelectControl from '../../../controls/SelectControl';
import {formatToTitleCase, valuesFromEnum} from '../../../util/Formatters';
import DrawableType from './DrawableType';

/**
* A client control that allows for selecting and creating drawables.
*/
export default class DrawableTypeControl {
    private view : ViewModel<any>;
    private drawableTypePicker : SelectControl<DrawableType>
    private _callback;

    constructor(view : ViewModel<any>, selectId : string, callback? : Function) {
        this.view = view;
        this.drawableTypePicker = new SelectControl<DrawableType>(
            this.view,
            selectId,
            valuesFromEnum(DrawableType),
            DrawableType[DrawableType.Container]);
            this._callback = callback || function() {};

            this.view.registerCallback("add-drawable", callback);
        }

        set callback(callback) {
            this._callback = callback;
        }

        get pickedDrawable() : string {
            return this.drawableTypePicker.value;
        }
    }
