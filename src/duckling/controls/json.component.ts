import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChange,
    AfterViewInit
} from '@angular/core';

import {immutableAssign, immutableArrayAssign} from '../util/model';
import {ChangeType, changeType} from '../state';

enum JsonValueType {
    Number,
    String,
    Boolean,
    Object,
    Array
}

/**
 * A Component used to display the json representing an arbitrary value.
 */
@Component({
    selector: "dk-json",
    styleUrls: ['./duckling/controls/json.component.css'],
    template: `
        <div
            *ngFor="let key of jsonKeys"
            [ngSwitch]="jsonValueType(value[key])">
            <dk-number-input
                *ngSwitchCase="JsonValueType.Number"
                [label]="key"
                [value]="value[key]"
                (validInput)="onValueChanged($event, key)">
            </dk-number-input>
            <dk-input
                *ngSwitchCase="JsonValueType.String"
                [label]="key"
                [value]="value[key]"
                (inputChanged)="onValueChanged($event, key)">
            </dk-input>
            <dk-checkbox
                *ngSwitchCase="JsonValueType.Boolean"
                [text]="key"
                [checked]="value[key]"
                (input)="onValueChanged($event, key)">
            </dk-checkbox>
            <dk-section
                *ngSwitchCase="JsonValueType.Object"
                [headerText]="key">
                <dk-json
                    [value]="value[key]"
                    (valueChanged)="onValueChanged($event, key)">
                </dk-json>
            </dk-section>
            <div *ngSwitchCase="JsonValueType.Array">
                <md-card class="array-card">
                    <dk-accordian
                        [elements]="value[key]"
                        [titlePrefix]="key + ': '"
                        [clone]="true"
                        (elementDeleted)="onValueChanged($event, key)"
                        (elementMovedDown)="onValueChanged($event, key)"
                        (elementMovedUp)="onValueChanged($event, key)"
                        (elementCloned)="onValueChanged($event, key)">
                        <template let-element="$element" let-index="$index">
                            <dk-json
                                [value]="element"
                                (valueChanged)="onValueChanged($event, key, index)">
                            </dk-json>
                        </template>
                    </dk-accordian>
                </md-card>
            </div>
        </div>
    `
})
export class JsonComponent {
    // hoist for template
    JsonValueType = JsonValueType;

    /**
     * The object that will be displayed as json.
     */
    @Input() value : any;

    /**
     * Emits when the json was changed with the new json
     */
    @Output() valueChanged = new EventEmitter<any>();

    onValueChanged(newValue : any, jsonKey : string, arrayIndex? : number) {
        let patch : any = {};
        if (arrayIndex !== undefined && arrayIndex !== null) {
            let patchArray : any[] = [];
            patchArray[arrayIndex] = newValue;
            patch[jsonKey] = immutableArrayAssign(this.value[jsonKey], patchArray);
        } else {
            patch[jsonKey] = newValue;
        }
        this.valueChanged.emit(immutableAssign(this.value, patch));
    }

    get jsonKeys() : string[] {
        let keys : string[] = [];
        for (let key in this.value) {
            keys.push(key);
        }
        return keys;
    }

    jsonValueType(json : any) : JsonValueType {
        if (this._isNumber(json)) {
            return JsonValueType.Number;
        } else if (this._isString(json)) {
            return JsonValueType.String;
        } else if (this._isBoolean(json)) {
            return JsonValueType.Boolean;
        } else if (this._isObject(json)) {
            return JsonValueType.Object;
        } else if (this._isArray(json)) {
            return JsonValueType.Array;
        }
        return null;
    }

    private _isArray(json : any) {
        return Array.isArray(json);
    }

    private _isObject(json : any) {
        return typeof json === 'object' && !this._isArray(json);
    }

    private _isNumber(json : any) {
        return typeof json === 'number';
    }

    private _isString(json : any) {
        return typeof json === 'string';
    }

    private _isBoolean(json : any) {
        return typeof json === 'boolean';
    }
}
