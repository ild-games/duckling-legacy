import { Component, Input, Output, EventEmitter } from "@angular/core";

/**
 * Helper component used to implement checkboxes
 */
@Component({
    selector: "dk-checkbox",
    template: `
        <mat-checkbox
            [checked]="checked"
            (change)="onValueChanged($event.checked)">
            {{text}}
        </mat-checkbox>
    `,
})
export class CheckboxComponent {
    /**
     * Text label displayed to the user.
     */
    @Input() text: string;
    /**
     * True if the checkbox is checked, otherwise false
     */
    @Input() checked: boolean;
    /**
     * Event published when the checkbox changes
     */
    @Output() input = new EventEmitter<boolean>();

    onValueChanged(newValue: boolean) {
        if (newValue === this.checked) {
            return;
        }

        this.input.emit(newValue);
    }
}
