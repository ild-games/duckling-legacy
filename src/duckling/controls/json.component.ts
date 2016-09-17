import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChange,
    AfterViewInit
} from '@angular/core';

import {immutableAssign} from '../util/model';
import {ChangeType, changeType} from '../state';

/**
 * A Component used to display the json representing an arbitrary value.
 */
@Component({
    selector: "dk-json",
    template: `
        <dk-validated-input
            label="JSON"
            [value]="valueAsJSON"
            [validator]="isValidJSON"
            (validInput)="onValueChanged($event)">
        </dk-validated-input>
    `
})
export class JsonComponent implements OnChanges {
    /**
     * The object that will be displayed as json.
     */
    @Input() value : any;

    /**
     * Emits when the json was changed with the new json
     */
    @Output() valueChanged = new EventEmitter<any>();

    private _displayedValue : any;

    ngOnChanges(changes : {value? : SimpleChange}) {
        if (changeType(this._displayedValue, changes.value.currentValue) !== ChangeType.Equal) {
            this._displayedValue = changes.value.currentValue;
        }
    }

    get valueAsJSON() {
        return JSON.stringify(this._displayedValue);
    }

    isValidJSON(json : string) {
        try {
            JSON.parse(json);
            return true;
        } catch (e) {
            return false;
        }
    }

    onValueChanged(newValue : string) {
        this._displayedValue = JSON.parse(newValue);
        this.valueChanged.emit(this._displayedValue);
    }
}
