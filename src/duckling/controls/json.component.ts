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


/**
 * A Component used to display the json representing an arbitrary value.
 */
@Component({
    selector: "dk-json",
    styleUrls: ['./duckling/controls/json.component.css'],
    template: `
        <div *ngFor="let key of jsonKeys">
            <dk-number-input
                *ngIf="isNumber(value[key])"
                [label]="key"
                [value]="value[key]"
                (validInput)="onValueChanged($event, key)">
            </dk-number-input>
            <dk-input
                *ngIf="isString(value[key])"
                [label]="key"
                [value]="value[key]"
                (inputChanged)="onValueChanged($event, key)">
            </dk-input>
            <dk-checkbox
                *ngIf="isBoolean(value[key])"
                [text]="key"
                [checked]="value[key]"
                (input)="onValueChanged($event, key)">
            </dk-checkbox>
            <dk-section
                *ngIf="isObject(value[key])"
                [headerText]="key">
                <dk-json
                    [value]="value[key]"
                    (valueChanged)="onValueChanged($event, key)">
                </dk-json>
            </dk-section>
            <div *ngIf="isArray(value[key])">
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

    isArray(json : any) {
        return Array.isArray(json);
    }

    isObject(json : any) {
        return typeof json === 'object' && !this.isArray(json);
    }

    isNumber(json : any) {
        return typeof json === 'number';
    }

    isString(json : any) {
        return typeof json === 'string';
    }

    isBoolean(json : any) {
        return typeof json === 'boolean';
    }

    get jsonKeys() : string[] {
        let keys : string[] = [];
        for (let key in this.value) {
            keys.push(key);
        }
        return keys;
    }

    noop(element : any, i : number) {
        console.log(i);
        console.log(element);
    }
}
