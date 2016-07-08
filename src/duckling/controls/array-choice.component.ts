import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MD_BUTTON_DIRECTIVES} from '@angular2-material/button';

import {ArraySelect} from './array-select.component';
import {SelectOption} from './array-select.component';
import {Icon} from './icon.component';

/**
 * Component used to display a select element of the options in an array along with a
 * button to add the currently selected element.
 */
@Component({
    selector: "dk-array-choice",
    directives: [ArraySelect, MD_BUTTON_DIRECTIVES, Icon],
    template: `
        <dk-array-select
            [value]="selected"
            [options]="options"
            (selection)="select($event)">
        </dk-array-select>
        <button
            md-icon-button
            (click)="onAddClicked()">
            <dk-icon iconClass="plus"></dk-icon>
        </button>
    `
})
export class ArrayChoiceComponent {
    @Input() options : SelectOption[];
    @Input() selected : string;
    @Output() addClicked = new EventEmitter<any>();

    select(arraySelection : string) {
        this.selected = arraySelection;
    }

    onAddClicked() {
        this.addClicked.emit(this.selected);
    }
}
