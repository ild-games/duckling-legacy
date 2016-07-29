import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MD_CHECKBOX_DIRECTIVES} from '@angular2-material/checkbox';

/**
 * Helper component used to implement checkboxes
 */
@Component({
    selector: "dk-checkbox",
    directives: [MD_CHECKBOX_DIRECTIVES],
    template:`
        <md-checkbox
            [checked]="checked"
            (change)="onValueChanged($event.checked)">
            {{text}}
        </md-checkbox>
    `
})
export class CheckboxComponent {
    /**
     * Text label displayed to the user.
     */
    @Input() text : string;
    /**
     * True if the checkbox is checked, otherwise false
     */
    @Input() checked : boolean;
    /**
     * Event published when the checkbox changes
     */
    @Output() input = new EventEmitter<boolean>();

    onValueChanged(newValue : boolean) {
        if (newValue === this.checked) {
            return;
        }

        this.input.emit(newValue);
    }
}
