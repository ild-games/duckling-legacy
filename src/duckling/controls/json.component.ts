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


export type Json = JsonObject | JsonArray;
export type JsonObject = {
    key: string,
    pieces: JsonPiece[]
};
export type JsonArray = {
    key: string,
    elements: JsonObject[]
};

export type JsonPiece = {
    key: string,
    value: JsonValue,
    type: string
    rawValue: any
};

export type JsonValue = JsonObject | JsonArray | number | string | boolean;

/**
 * A Component used to display the json representing an arbitrary value.
 */
@Component({
    selector: "dk-json",
    styleUrls: ['./duckling/controls/json.component.css'],
    template: `
        <div
            *ngFor="let jsonPiece of jsonObject.pieces"
            class="jsonPiece">
            <div *ngIf="jsonPiece.type !== 'object'">
                <dk-number-input
                    *ngIf="jsonPiece.type === 'number'"
                    [label]="jsonPiece.key"
                    [value]="jsonPiece.value"
                    (validInput)="onValueChanged($event, jsonPiece.key)">
                </dk-number-input>
                <dk-input
                    *ngIf="jsonPiece.type === 'string'"
                    [label]="jsonPiece.key"
                    [value]="jsonPiece.value"
                    (inputChanged)="onValueChanged($event, jsonPiece.key)">
                </dk-input>
                <dk-checkbox
                    *ngIf="jsonPiece.type === 'boolean'"
                    [checked]="jsonPiece.value"
                    [text]="jsonPiece.key"
                    (input)="onValueChanged($event, jsonPiece.key)">
                </dk-checkbox>
            </div>
            <dk-section
                *ngIf="jsonPiece.type === 'object'"
                [headerText]="jsonPiece.key">
                <dk-json
                    [value]="jsonPiece.rawValue"
                    (valueChanged)="onValueChanged($event, jsonPiece.key)">
                </dk-json>
            </dk-section>
        </div>
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

    jsonObject : JsonObject = {
        key: "",
        pieces: []
    };

    ngOnChanges(changes : {value? : SimpleChange}) {
        if (changes.value) {
            this.jsonObject = this._jsonObject(changes.value.currentValue);
        }
    }

    isValidJSON(json : string) {
        try {
            JSON.parse(json);
            return true;
        } catch (e) {
            return false;
        }
    }

    onValueChanged(newValue : any, jsonKey : string) {
        let patch : any = {};
        patch[jsonKey] = newValue;
        this.valueChanged.emit(immutableAssign(this.value, patch));
    }

    private _jsonObject(json : any) : JsonObject {
        let jsonPieces : JsonObject = {
            key: "",
            pieces: []
        };
        for (let key in json) {
            jsonPieces.pieces.push(this._jsonPiece(key, json[key]));
        }
        return jsonPieces;
    }

    private _jsonPiece(key : string, value : any) : JsonPiece {
        let type = this._jsonValueType(value);
        return {
            key: key,
            type: type,
            value: this._jsonValue(value, type),
            rawValue: value
        };
    }

    private _jsonValue(rawValue : any, type : string) : JsonValue {
        let returnValue : JsonValue;
        if (type === 'object') {
            returnValue = this._jsonObject(rawValue);
        } else if (type === 'array') {
            let array : JsonArray = {
                key: "",
                elements: []
            };
            for (let i = 0; i < rawValue['length']; i++) {
                array.elements.push(this._jsonObject(rawValue[i]));
            }
            returnValue = array;
        } else {
            returnValue = rawValue;
        }
        return returnValue;
    }

    private _jsonValueType(rawValue : any) : string {
        let type = typeof rawValue;
        if (type === 'object' && Array.isArray(rawValue)) {
            type = 'array';
        }
        return type;
    }
}
