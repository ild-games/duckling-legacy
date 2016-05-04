import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

import {SelectOption, ArraySelect} from './array-select.component';
import {isInteger} from '../math/number-utils';

/**
 * Select control that allows the user to pick from a typescript enum.
 */
@Component({
    selector: "dk-enum-select",
    directives: [ArraySelect],
    template:`
        <dk-array-select
            [value]="value"
            [options]="enumOptions()"
            (selection)="onSelectionChanged($event)">
        </dk-array-select>
    `
})
export class EnumSelect {
    /**
     * The selected enum value.
     */
    @Input() value : number;

    /**
     * The enum the user can pick from.
     */
    @Input() enum : any;

    /**
     * Event published with the new enum value when the user changes their selection.
     */
    @Output() selection : EventEmitter<number> = new EventEmitter();

    enumOptions() {
        var options : SelectOption[] = [];
        for(var value in this.enum) {
            if (isInteger(Number(value))) {
                options.push({
                    value,
                    title : this.enum[value]
                });
            }
        }
        return options;
    }

    onSelectionChanged(newValue : string) {
        this.selection.emit(Number(newValue));
    }
}
