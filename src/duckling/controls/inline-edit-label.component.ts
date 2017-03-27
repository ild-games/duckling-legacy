import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Displays a label with a pencil icon that can be used to start editting the value.
 */
@Component({
    selector: "dk-inline-edit-label",
    template: `
        <span>
            {{label}}
        </span>
        <dk-icon-button
            icon="pencil"
            [tooltip]="tooltip"
            (click)="onEditClicked()">
        </dk-icon-button>
    `
})
export class InlineEditLabelComponent {
    /**
     * Label the end user will see.
     */
    @Input() label : string;

    /**
     * Tootlip the user sees when they hover over the pencil.
     */
    @Input() tooltip : string;

    /**
     * Event that fires when the user clicks on the pencil to start editing the value.
     */
    @Output() startEdit = new EventEmitter<any>();

    onEditClicked() {
        this.startEdit.emit(true);
    }
}
