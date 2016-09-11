import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {ValidatedInput} from './validated-input.component';

var numberRegex=/^\-?[0-9]+(\.[0-9]+)?$/;

/**
 * Validated input that only publishes events when the input contains a number.
 */
@Component({
    selector: "dk-number-input",
    directives: [ValidatedInput],
    styleUrls: ['./duckling/controls/number-input.component.css'],
    template:`
        <dk-validated-input
            [disabled]="disabled"
            [label]="label"
            [value]="value"
            [validator]="isNumber"
            (validInput)="onInput($event)">
        </dk-validated-input>
    `
})
export class NumberInput {
    /**
     * Text label displayed to the user.
     */
    @Input() label : string;
    /**
     * The value stored in the control.
     */
    @Input() value : number;
    /**
     * True if the input is disabled, otherwise false
     */
    @Input() disabled : boolean;

    /**
     * Event published when the user enters a valid input.
     */
    @Output() validInput = new EventEmitter<number>();

    onInput(value : string) {
        this.validInput.emit(parseFloat(value));
    }

    isNumber(value : string) {
        return value.match(numberRegex) !== null;
    }
}
