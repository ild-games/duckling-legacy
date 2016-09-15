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

import {ValidatedInput} from './index';

/**
 * A Component used to display the json representing an arbitrary value.
 */
@Component({
    selector: "dk-json",
    directives: [ValidatedInput],
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

    private _stringValue = "";

    ngOnChanges(changes : {value? : SimpleChange}) {
        if (changes.value.currentValue !== this.value) {
            this._stringValue = JSON.stringify(changes.value.currentValue, null, 4);
        }
    }

    get valueAsJSON() {
        if (this._stringValue === "") {
            this._stringValue = JSON.stringify(this.value, null, 4);
        }
        return this._stringValue;
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
        this.valueChanged.emit(JSON.parse(newValue));
    }
}
