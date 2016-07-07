import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {InputComponent} from './input.component';

/**
 * Helper component used to implement input controls that only accept certain inputs.
 */
@Component({
    selector: "dk-validated-input",
    directives: [InputComponent],
    template:`
        <dk-input
            [label]="label"
            [value]="value"
            (inputChanged)="onUserInput($event)">
        </dk-input>
    `
})
export class ValidatedInput {
    /**
     * Text label displayed to the user.
     */
    @Input() label : string;
    /**
     * The value stored in the control.
     */
    @Input() value : string;
    /**
     * Function used to validate the users input. Should return true if the users input is valid.
     */
    @Input() validator : (value:string) => string;

    /**
     * Event published when the user enters a valid input.
     */
    @Output() validInput = new EventEmitter<String>();

    onUserInput(newValue : string) {
        if (this.validator(newValue)) {
            this.validInput.emit(newValue);
        }
    }
}
