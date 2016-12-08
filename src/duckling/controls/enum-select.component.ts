import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';

import {SelectOption, ArraySelectComponent} from './array-select.component';
import {isInteger} from '../math/number-utils';

/**
 * Select control that allows the user to pick from a typescript enum.
 */
@Component({
    selector: "dk-enum-select",
    template:`
        <dk-array-select
            [value]="value"
            [options]="options"
            (selection)="onSelectionChanged($event)">
        </dk-array-select>
    `,
    changeDetection : ChangeDetectionStrategy.OnPush,
})
export class EnumSelectComponent implements AfterViewInit {
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
    @Output() selection = new EventEmitter<number>();

    public options : SelectOption[] = [];

    ngAfterViewInit() {
        this.options = this.enumOptions();
    }

    enumOptions() {
        let options : SelectOption[] = [];
        for(let value in this.enum) {
            if (isInteger(Number(value))) {
                options.push({
                    value,
                    title : this.enum[value],
                });
            }
        }
        return options;
    }

    onSelectionChanged(newValue : string) {
        this.selection.emit(Number(newValue));
    }
}
