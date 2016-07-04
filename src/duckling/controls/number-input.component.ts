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
    template:`
        <dk-validated-input
            [label]="label"
            [value]="value"
            [validator]="isNumber"
            (validInput)="onInput($event)">
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
