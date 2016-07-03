import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

/**
 * Helper component used to implement input controls that only accept certain inputs.
 */
@Component({
    selector: "validated-input",
    directives: [MD_INPUT_DIRECTIVES],
    template:`
        <md-input
            [placeholder]="label"
            value="{{value}}"
            (input)="onUserInput($event.target.value)">
        </md-input>
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
