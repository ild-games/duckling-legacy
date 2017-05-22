import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChange,
    OnInit
} from '@angular/core';

import {immutableAssign, immutableArrayAssign} from '../util/model';
import {ChangeType, changeType} from '../state';
import {jsonToSchema} from '../controls/json-schema-edit.component';
import {getDefaultForSchema, JsonSchema, JsonSchemaValue} from '../util/json-schema';

export enum JsonValueType {
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
    styleUrls: [
        './duckling/controls/json.component.css',
        './duckling/layout.css'
    ],
    template: `
        <div
            *ngFor="let key of jsonKeys"
            [ngSwitch]="jsonValueType(schema[key])">
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
                    [schema]="schema[key]"
                    (valueChanged)="onValueChanged($event, key)">
                </dk-json>
            </dk-section>
            <div *ngSwitchCase="JsonValueType.Array">
                <span>{{key}}</span>
                <button
                    md-icon-button
                    class="dk-inline"
                    [disableRipple]="true"
                    (click)="onArrayAddClicked(key)">
                    <dk-icon iconClass="plus"></dk-icon>
                </button>
                <md-card class="array-card">
                    <dk-accordian
                        [elements]="value[key]"
                        [titlePrefix]="key + ': '"
                        [clone]="true"
                        (elementDeleted)="onValueChanged($event, key)"
                        (elementMovedDown)="onValueChanged($event, key)"
                        (elementMovedUp)="onValueChanged($event, key)"
                        (elementCloned)="onValueChanged($event, key)">
                        <ng-template let-element="$element" let-index="$index">
                            <dk-json
                                [value]="element"
                                [schema]="schema[key][0]"
                                (valueChanged)="onValueChanged($event, key, index)">
                            </dk-json>
                        </ng-template>
                    </dk-accordian>
                </md-card>
            </div>
        </div>
    `
})
export class JsonComponent implements OnInit {
    // hoist for template
    JsonValueType = JsonValueType;

    /**
     * The object that will be displayed as json.
     */
    @Input() value : any;

    /**
     * Optional schema the json component should follow. If not provided the 
     * schema will be inferred as best as it can be by the given json.
     */
    @Input() schema : JsonSchema;

    /**
     * Emits when the json was changed with the new json
     */
    @Output() valueChanged = new EventEmitter<any>();

    ngOnInit() {
        if (!this.schema) {
            this.schema = jsonToSchema(this.value); 
        }
    }

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
    
    onArrayAddClicked(key : string) {
        let patchArray = [];
        patchArray[this.value[key].length] = getDefaultForSchema((this.schema[key] as JsonSchema[])[0] as JsonSchema);
        let patch : any = {};
        patch[key] = immutableArrayAssign(this.value[key], patchArray);
        this.valueChanged.emit(immutableAssign(this.value, patch));
    }
    
    jsonValueType(schemaValue : JsonSchemaValue) : JsonValueType {
        if (schemaValue === "number") {
            return JsonValueType.Number;
        } else if (schemaValue === "string") {
            return JsonValueType.String;
        } else if (schemaValue === "boolean") {
            return JsonValueType.Boolean;
        } else if (Array.isArray(schemaValue)) {
            return JsonValueType.Array;
        } else if (typeof schemaValue === "object") {
            return JsonValueType.Object;
        }
        return null;
    }

    get jsonKeys() : string[] {
        let keys : string[] = [];
        for (let key in this.value) {
            keys.push(key);
        }
        return keys;
    }
}