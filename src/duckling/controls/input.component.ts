import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

/**
 * Helper component used to implement input controls
 */
@Component({
    selector: "dk-input",
    styleUrls: ['./duckling/controls/input.component.css'],
    template:`
        <md-input
            [disabled]="disabled"
            [placeholder]="label"
            dividerColor="{{dividerColor}}"
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
     * The color of the input field
     */
    @Input() dividerColor : string = "primary";
    /**
     * Event published when the user enters input.
     */
    @Output() inputChanged = new EventEmitter<String>();

    onUserInput(newValue : string) {
        this.inputChanged.emit(newValue);
    }
}
