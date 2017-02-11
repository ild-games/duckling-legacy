import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnChanges,
    SimpleChange,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import {MdSelect} from '@angular/material';

/**
 * Select control that accepts an array of options.
 */
@Component({
    selector: "dk-array-select",
    template:`
        <md-select #mdSelect
            (onClose)="onSelectionChanged()">
            <md-option 
                *ngFor="let option of options" 
                [value]="option.value">
                {{option.title}}
            </md-option>
        </md-select>
    `
})
export class ArraySelectComponent implements OnChanges, AfterViewInit {
    @ViewChild(MdSelect) mdSelect : MdSelect;
    
    /**
     * The selected value.
     */
    @Input() value : string;

    /**
     * The available options.
     */
    @Input() options : SelectOption[];

    /**
     * Event that is published with the new value whenever the user changes it.
     */
    @Output() selection = new EventEmitter<string>();

    constructor(private _changeDetector : ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        this.mdSelect.writeValue(this.value);
        this._changeDetector.detectChanges();
    }

    ngOnChanges(changes : {value? : SimpleChange, options? : SimpleChange}) {
        if (!this.mdSelect.options) {
            return;
        }
        
        if (changes.value) {
            this.mdSelect.writeValue(changes.value.currentValue);
        } else if (changes.options) {
            this.mdSelect.writeValue(this.value);
        }
    }

    onSelectionChanged() {
        if (this.mdSelect.selected) {
            this.selection.emit(this.mdSelect.selected.value);
        }
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

/**
 * Takes an array of values and returns SelectOptions for those values. This will
 * set the values to be all lowercase and the title of the SelectOptions will
 * have the first letter in uppercase
 *
 * @param values string array of values to turn into SelectOptions
 * @return array of SelectOptions based on the values
 */
export function toSelectOptions<T extends string>(...values : T[]) : SelectOption[] {
    let selectOptions : SelectOption[] = [];
    for (let value of values) {
        selectOptions.push(toSelectOption(value));
    }
    return selectOptions;
}

/**
 * Takes a value and returns a SelectOption for the value. This will
 * set the value to be all lowercase and the title of the SelectOption will
 * have the first letter in uppercase
 *
 * @param value string value to turn into a SelectOption
 * @return SelectOption based on the value
 */
export function toSelectOption<T extends string>(value : T) : SelectOption {
    return {
        value: value.toLowerCase(),
        title: value.substring(0, 1).toUpperCase() + value.substring(1)
    };
}
