import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ViewChild,
    ElementRef
} from '@angular/core';

import {InputComponent} from './input.component';

/**
 * Validator is a function that is run to determine if a given string input is valid
 */
export type Validator = (value : string) => boolean;

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
            [dividerColor]="inputColor"
            (inputChanged)="onUserInput($event)">
        </dk-input>
    `
})
export class ValidatedInput implements AfterViewInit {
    /**
     * Text label displayed to the user.
     */
    @Input() label : string;
    /**
     * The value stored in the control.
     */
    @Input() value : string;
    /**
     * Functions used to validate the users input. Should return true if the users input is valid.
     */
    @Input() validator : Validator;
    /**
     * True if the input is disabled, otherwise false
     */
    @Input() disabled : boolean;

    /**
     * Event published when the user enters a valid input.
     */
    @Output() validInput = new EventEmitter<String>();

    valid : boolean = true;

    ngAfterViewInit() {
        this._checkValidity(this.value);
    }

    onUserInput(newValue : string) {
        this._checkValidity(newValue);
        if (this.valid) {
            this.validInput.emit(newValue);
        }
    }

    private _checkValidity(valueToCheck : string) {
        if (valueToCheck !== undefined || valueToCheck !== null) {
            this.valid = this.validator(valueToCheck);
        } else {
            this.valid = false;
        }
    }

    get inputColor() : string {
        if (this.valid) {
            return "primary";
        }
        return "warn";
    }
}
