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
    template:`
        <md-input
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
     * Event published when the user enters input.
     */
    @Output() inputChanged = new EventEmitter<String>();

    onUserInput(newValue : string) {
        this.inputChanged.emit(newValue);
    }
}
