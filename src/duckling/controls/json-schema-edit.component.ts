import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    SimpleChange,
} from "@angular/core";

import { CustomAttribute } from "../project/custom-attribute";
import { JsonValueType } from "../controls/json.component";
import {
    immutableAssign,
    immutableArrayAssign,
    immutableArrayDelete,
} from "../util/model";
import {
    toSelectOptions,
    SelectOption,
} from "../controls/array-select.component";
import { JsonSchema } from "../util/json-schema";

export interface JsonSchemaEdit {
    keys: string[];
    contents: JsonSchemaEditValue[];
}

export type JsonSchemaEditValue =
    | "number"
    | "string"
    | "boolean"
    | JsonSchemaEdit
    | JsonSchemaEdit[];

@Component({
    selector: "dk-json-schema-edit",
    styleUrls: [
        "./duckling/layout.css",
        "./duckling/controls/json-schema-edit.component.css",
    ],
    template: `
        <div class="json-content">
            {{ '{' }}
            <div
                *ngFor="let index of getKeyIndices()"
                class="json-key">
                
                <dk-input
                    class="dk-inline"
                    [value]="jsonSchema.keys[index]"
                    (inputChanged)="onKeyChanged($event, index)">
                </dk-input>
                :
                <dk-array-select
                    class="dk-inline"
                    [value]="defaultSelectValue(jsonType(jsonSchema.contents[index]))"
                    [options]="jsonTypeSelects"
                    (selection)="onTypeChanged($event, index)">
                </dk-array-select>
                <dk-delete-button 
                    class="dk-inline"
                    (deleteClick)="deleteProperty(index)">
                </dk-delete-button>
                
                <div [ngSwitch]="jsonType(jsonSchema.contents[index])">
                    <div *ngSwitchCase="JsonValueType.Object">
                        <dk-json-schema-edit
                            [jsonSchema]="jsonSchema.contents[index]"
                            (jsonSchemaChanged)="onChildJsonObjectChanged($event, index)">
                        </dk-json-schema-edit>
                    </div>
                    
                    <div *ngSwitchCase="JsonValueType.Array">
                        <div>{{ '[' }}</div>
                        <div class="array-type">
                            <dk-json-schema-edit
                                class="array-type"
                                [jsonSchema]="jsonSchema.contents[index][0]"
                                (jsonSchemaChanged)="onChildJsonArrayChanged($event, index)">
                            </dk-json-schema-edit>
                        </div>
                        <div>{{ ']' }}</div>
                    </div>
                </div>
            </div>
            <div class="json-key">
                <button
                    mat-raised-button
                    title="Add new property"
                    (click)="onNewPropertyAdded()">
                    Add New Property
                </button>
            </div>
            {{ '}' }}
        </div>
            
    `,
})
export class JsonSchemaEditComponent {
    // hoist for template
    JsonValueType = JsonValueType;
    jsonTypeSelects: SelectOption[] = toSelectOptions<string>(
        "number",
        "string",
        "boolean",
        "object",
        "array"
    );

    @Input() jsonSchema: JsonSchemaEdit;
    @Output() jsonSchemaChanged = new EventEmitter<JsonSchemaEdit>();

    private _newPropertyKey = "new-property";

    onKeyChanged(newKey: string, index: number) {
        if (!this.isValidKeyName(newKey, index)) {
            return;
        }

        let keysPatch = [];
        keysPatch[index] = newKey;
        let newSchema = {
            keys: immutableArrayAssign(this.jsonSchema.keys, keysPatch),
            contents: this.jsonSchema.contents,
        };
        this.jsonSchemaChanged.emit(newSchema);
    }

    onTypeChanged(newType: string, index: number) {
        let contentsPatch: JsonSchemaEditValue[];
        switch (newType) {
            case "array":
                let newArrayValue: any = [];
                newArrayValue[index] = [];
                newArrayValue[index][0] = { keys: [], contents: [] };
                contentsPatch = immutableArrayAssign(
                    this.jsonSchema.contents,
                    newArrayValue
                );
                break;
            case "object":
                let newObjectValue: any = [];
                newObjectValue[index] = { keys: [], contents: [] };
                contentsPatch = immutableArrayAssign(
                    this.jsonSchema.contents,
                    newObjectValue
                );
                break;
            case "number":
            case "string":
            case "boolean":
                let newPrimitiveValue: any = [];
                newPrimitiveValue[index] = newType;
                contentsPatch = immutableArrayAssign(
                    this.jsonSchema.contents,
                    newPrimitiveValue
                );
                break;
        }
        this.jsonSchemaChanged.emit({
            keys: this.jsonSchema.keys,
            contents: contentsPatch,
        });
    }

    onNewPropertyAdded() {
        let keysPatch: string[] = [];
        let contentsPatch: JsonSchemaEditValue[] = [];
        keysPatch[
            this.jsonSchema.keys.length
        ] = this._generateUniquePropertyKey();
        contentsPatch[this.jsonSchema.contents.length] = "number";
        this.jsonSchemaChanged.emit({
            keys: immutableArrayAssign(this.jsonSchema.keys, keysPatch),
            contents: immutableArrayAssign(
                this.jsonSchema.contents,
                contentsPatch
            ),
        });
    }

    deleteProperty(index: number) {
        let newSchema = {
            keys: immutableArrayDelete(this.jsonSchema.keys, index) as string[],
            contents: immutableArrayDelete(
                this.jsonSchema.contents,
                index
            ) as JsonSchemaEditValue[],
        };
        this.jsonSchemaChanged.emit(newSchema);
    }

    /**
     * Generates a property key that is not currently in the existing keys.
     */
    private _generateUniquePropertyKey(): string {
        let nextInstance = 1;
        for (let key of this.jsonSchema.keys) {
            if (key.startsWith(this._newPropertyKey)) {
                let keyParts = key.split(this._newPropertyKey);
                if (keyParts[1] && !isNaN(parseInt(keyParts[1]))) {
                    nextInstance = parseInt(keyParts[1]) + 1;
                }
            }
        }
        return this._newPropertyKey + nextInstance;
    }

    onChildJsonObjectChanged(newJsonSchema: JsonSchemaEdit, index: number) {
        let contentsPatch: JsonSchemaEditValue[] = [];
        contentsPatch[index] = newJsonSchema;
        this.jsonSchemaChanged.emit({
            keys: this.jsonSchema.keys,
            contents: immutableArrayAssign(
                this.jsonSchema.contents,
                contentsPatch
            ),
        });
    }

    onChildJsonArrayChanged(newJsonSchema: JsonSchemaEdit, index: number) {
        let contentsPatch: JsonSchemaEditValue[] = [];
        contentsPatch[index] = [];
        (contentsPatch[index] as JsonSchemaEdit[])[0] = newJsonSchema;
        this.jsonSchemaChanged.emit({
            keys: this.jsonSchema.keys,
            contents: immutableArrayAssign(
                this.jsonSchema.contents,
                contentsPatch
            ),
        });
    }

    isValidKeyName(
        newKeyName: string,
        index: number,
        schemaToCheck?: JsonSchemaEdit
    ): boolean {
        schemaToCheck = schemaToCheck || this.jsonSchema;
        if (!this._isKeySafe(newKeyName)) {
            return false;
        }
        for (let i = 0; i < schemaToCheck.keys.length; i++) {
            if (i !== index && schemaToCheck.keys[i] === newKeyName) {
                return false;
            }
        }

        return true;
    }

    /**
     * Key can only contain alphanumeric, underscore, and dash characters
     */
    private _isKeySafe(key: string) {
        return key && key !== "" && /^([a-zA-Z0-9_-]+)$/.test(key);
    }

    jsonType(rhs: JsonSchemaEditValue): JsonValueType {
        if (rhs === "string") {
            return JsonValueType.String;
        } else if (rhs === "number") {
            return JsonValueType.Number;
        } else if (rhs === "boolean") {
            return JsonValueType.Boolean;
        } else if (Array.isArray(rhs)) {
            return JsonValueType.Array;
        } else if (typeof rhs === "object") {
            return JsonValueType.Object;
        }
    }

    defaultSelectValue(jsonValueType: JsonValueType) {
        switch (jsonValueType) {
            case JsonValueType.Number:
                return "number";
            case JsonValueType.String:
                return "string";
            case JsonValueType.Boolean:
                return "boolean";
            case JsonValueType.Object:
                return "object";
            case JsonValueType.Array:
                return "array";
        }
    }

    getKeyIndices(): number[] {
        let indices: number[] = [];
        for (let i = 0; i < this.jsonSchema.keys.length; i++) {
            indices.push(i);
        }
        return indices;
    }
}

/**
 * Takes in a schema for a json skeleton and returns that skeleton in a json object
 *
 * @param jsonSchema the JsonSchemaEdit to convert to json
 *
 * @returns json representation of the schema
 */
export function schemaEditToJson(jsonSchema: JsonSchemaEdit): any {
    let json: any = {};
    for (let i = 0; i < jsonSchema.keys.length; i++) {
        let content: any;
        if (Array.isArray(jsonSchema.contents[i])) {
            content = [];
            for (let schema of jsonSchema.contents[i] as JsonSchemaEdit[]) {
                content.push(schemaEditToJson(schema));
            }
        } else if (typeof jsonSchema.contents[i] === "object") {
            content = schemaEditToJson(jsonSchema.contents[
                i
            ] as JsonSchemaEdit);
        } else {
            content = jsonSchema.contents[i];
        }
        json[jsonSchema.keys[i]] = content;
    }
    return json;
}

/**
 *
 * If an array in the given json is empty then the array will simply not be present in the
 * schema as no contextual information about the contents of the array can be made.
 */
export function jsonToSchema(json: any): JsonSchema {
    let jsonSchema: JsonSchema = {};
    for (let key in json) {
        if (_isNumber(json[key])) {
            jsonSchema[key] = "number";
        } else if (_isString(json[key])) {
            jsonSchema[key] = "string";
        } else if (_isBoolean(json[key])) {
            jsonSchema[key] = "boolean";
        } else if (_isObject(json[key])) {
            jsonSchema[key] = jsonToSchema(json[key]);
        } else if (_isArray(json[key])) {
            if (json[key].length > 0) {
                jsonSchema[key] = [];
                (jsonSchema[key] as JsonSchema[]).push(
                    jsonToSchema(json[key][0])
                );
            }
        }
    }
    return jsonSchema;
}

function _isArray(json: any) {
    return Array.isArray(json);
}

function _isObject(json: any) {
    return typeof json === "object" && !_isArray(json);
}

function _isNumber(json: any) {
    return typeof json === "number";
}

function _isString(json: any) {
    return typeof json === "string";
}

function _isBoolean(json: any) {
    return typeof json === "boolean";
}
