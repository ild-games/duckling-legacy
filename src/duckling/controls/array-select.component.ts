import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

/**
 * Select control that accepts an array of options.
 */
@Component({
    selector: "dk-array-select",
    template:`
        <select [ngModel]="value" (input)="onSelectionChanged($event.target.selectedIndex)">
            <option *ngFor="#option of options" [value]="option.value">
                {{option.title}}
            </option>
        </select>
    `
})
export class ArraySelect {
    /**
     * The selected value.
     */
    @Input() value : string;

    /**
     * The available options.
     */
    @Input() options : SelectOption [];

    /**
     * Event that is published with the new value whenever the user changes it.
     */
    @Output() selection : EventEmitter<String> = new EventEmitter();

    onSelectionChanged(index : number) {
        this.selection.emit(this.options[index].value);
    }

    indexOfValue(value : string) {
        return this.options.findIndex(option => option.value === value)
    }
}

/**
 * Describes a single option provided to the user.
 */
export interface SelectOption {
    value: string;
    title: string;
}
