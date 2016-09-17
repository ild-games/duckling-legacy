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
    styleUrls: ['./duckling/controls/validated-input.component.css'],
    template:`
        <dk-input
            [disabled]="disabled"
            [label]="label"
            [value]="value"
            [dividerColor]="valid ? 'primary' : 'warn'"
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
    @Input() validator : (value:string) => boolean;
    /**
     * True if the input is disabled, otherwise false
     */
    @Input() disabled : boolean;

    /**
     * Event published when the user enters a valid input.
     */
    @Output() validInput = new EventEmitter<String>();

    valid : boolean = true;

    onUserInput(newValue : string) {
        if (this.validator(newValue)) {
            this.valid = true;
            this.validInput.emit(newValue);
        } else {
            this.valid = false;
        }
    }
}
