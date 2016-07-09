import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

/**
 * Helper component used to implement input controls
 */
@Component({
    selector: "dk-input",
    directives: [MD_INPUT_DIRECTIVES],
    styleUrls: ['./duckling/controls/input.component.css'],
    template:`
        <md-input
            [disabled]="disabled"
            [placeholder]="label"
            value="{{value}}"
            (input)="onUserInput($event.target.value)">
        </md-input>
    `
})
export class InputComponent {
    /**
     * Text label displayed to the user.
     */
    @Input() label : string;
    /**
     * The value stored in the control.
     */
    @Input() value : string;
    /**
     * True if the input element is disabled.
     */
    @Input() disabled : boolean;
    /**
     * Event published when the user enters input.
     */
    @Output() inputChanged = new EventEmitter<String>();

    onUserInput(newValue : string) {
        this.inputChanged.emit(newValue);
    }
}
