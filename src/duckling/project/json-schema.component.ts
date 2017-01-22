import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    SimpleChange
} from '@angular/core';

import {CustomAttribute} from './custom-attribute';
import {JsonValueType} from '../controls/json.component';
import {immutableAssign, immutableArrayAssign, immutableArrayDelete} from '../util/model';
import {toSelectOptions, SelectOption} from '../controls/array-select.component';

export interface JsonSchema {
    keys: string[],
    contents: JsonSchemaValue[]
}

export type JsonSchemaValue = "number" | "string" | "boolean" | JsonSchema | JsonSchema[];

@Component({
    selector: "dk-json-schema",
    styleUrls: [
        './duckling/layout.css',
        './duckling/project/json-schema.component.css'
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
                        <dk-json-schema
                            [jsonSchema]="jsonSchema.contents[index]"
                            (jsonSchemaChanged)="onChildJsonObjectChanged($event, index)">
                        </dk-json-schema>
                    </div>
                    
                    <div *ngSwitchCase="JsonValueType.Array">
                        <div>{{ '[' }}</div>
                        <div class="array-type">
                            <dk-json-schema
                                class="array-type"
                                [jsonSchema]="jsonSchema.contents[index][0]"
                                (jsonSchemaChanged)="onChildJsonArrayChanged($event, index)">
                            </dk-json-schema>
                        </div>
                        <div>{{ ']' }}</div>
                    </div>
                </div>
            </div>
            <div class="json-key">
                <button
                    md-raised-button
                    title="Add new property"
                    (click)="onNewPropertyAdded()">
                    Add New Property
                </button>
            </div>
            {{ '}' }}
        </div>
            
    `
})
export class JsonSchemaComponent {
    // hoist for template
    JsonValueType = JsonValueType;
    jsonTypeSelects : SelectOption[] = toSelectOptions<string>("number", "string", "boolean", "object", "array");
    
    @Input() jsonSchema : JsonSchema;
    @Output() jsonSchemaChanged = new EventEmitter<JsonSchema>();

    private _newPropertyKey = "new-property";

    onKeyChanged(newKey : string, index : number) {
        if (!this.isValidKeyName(newKey, index)) {
            return;
        }
        
        let keysPatch = [];
        keysPatch[index] = newKey;
        let newSchema = {
            keys: immutableArrayAssign(this.jsonSchema.keys, keysPatch),
            contents: this.jsonSchema.contents
        };
        this.jsonSchemaChanged.emit(newSchema);
    }

    onTypeChanged(newType : string, index : number) {
        let contentsPatch : JsonSchemaValue[];
        switch (newType) {
            case "array":
                let newArrayValue : any = [];
                newArrayValue[index] = [];
                newArrayValue[index][0] = {keys: [], contents: []};
                contentsPatch = immutableArrayAssign(this.jsonSchema.contents, newArrayValue);
                break;
            case "object":
                let newObjectValue : any = [];
                newObjectValue[index] = {keys: [], contents: []};
                contentsPatch = immutableArrayAssign(this.jsonSchema.contents, newObjectValue);
                break;
            case "number":
            case "string":
            case "boolean":
                let newPrimitiveValue : any = [];
                newPrimitiveValue[index] = newType;
                contentsPatch = immutableArrayAssign(this.jsonSchema.contents, newPrimitiveValue);
                break;
        }
        this.jsonSchemaChanged.emit({
            keys: this.jsonSchema.keys,
            contents: contentsPatch
        });
    }

    onNewPropertyAdded() {
        let keysPatch : string[] = [];
        let contentsPatch : JsonSchemaValue[] = [];
        keysPatch[this.jsonSchema.keys.length] = this._generateUniquePropertyKey();
        contentsPatch[this.jsonSchema.contents.length] = "number";
        this.jsonSchemaChanged.emit({
            keys: immutableArrayAssign(this.jsonSchema.keys, keysPatch),
            contents: immutableArrayAssign(this.jsonSchema.contents, contentsPatch)
        });
    }

    deleteProperty(index : number) {
        let newSchema = {
            keys: (immutableArrayDelete(this.jsonSchema.keys, index) as string[]),
            contents: (immutableArrayDelete(this.jsonSchema.contents, index) as JsonSchemaValue[])
        };
        this.jsonSchemaChanged.emit(newSchema);
    }

    /**
     * Generates a property key that is not currently in the existing keys.
     */
    private _generateUniquePropertyKey() : string {
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
    
    onChildJsonObjectChanged(newJsonSchema : JsonSchema, index : number) {
        let contentsPatch : JsonSchemaValue[] = [];
        contentsPatch[index] = newJsonSchema;
        this.jsonSchemaChanged.emit({
            keys: this.jsonSchema.keys,
            contents: immutableArrayAssign(this.jsonSchema.contents, contentsPatch)
        });
    }
    
    onChildJsonArrayChanged(newJsonSchema : JsonSchema, index : number) {
        let contentsPatch : JsonSchemaValue[] = [];
        contentsPatch[index] = [];
        (contentsPatch[index] as JsonSchema[])[0] = newJsonSchema;
        this.jsonSchemaChanged.emit({
            keys: this.jsonSchema.keys,
            contents: immutableArrayAssign(this.jsonSchema.contents, contentsPatch)
        });
    }
    
    isValidKeyName(newKeyName : string, index : number, schemaToCheck? : JsonSchema) : boolean {
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
    private _isKeySafe(key : string) {
        return (
            key &&
            key !== "" &&
            /^([a-zA-Z0-9_-]+)$/.test(key)
        );
    }

    jsonType(rhs : JsonSchemaValue) : JsonValueType {
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

    defaultSelectValue(jsonValueType : JsonValueType) {
        switch (jsonValueType) {
            case JsonValueType.Number:
                return 'number';
            case JsonValueType.String:
                return 'string';
            case JsonValueType.Boolean:
                return 'boolean';
            case JsonValueType.Object:
                return 'object';
            case JsonValueType.Array:
                return 'array';
        }
    }

    getKeyIndices() : number[] {
        let indices : number[] = [];
        for (let i = 0; i < this.jsonSchema.keys.length; i++) {
            indices.push(i);
        }
        return indices;
    }

}

/**
 * Takes in a schema for a json skeleton and returns that skeleton in a json object
 * 
 * @param jsonSchema the JsonSchema to convert to json
 * 
 * @returns json representation of the schema
 */
export function schemaToJson(jsonSchema : JsonSchema) : any {
    let json : any = {};
    for (let i = 0; i < jsonSchema.keys.length; i++) {
        let content : any;
        if (Array.isArray(jsonSchema.contents[i])) {
            content = [];
            for (let schema of jsonSchema.contents[i] as JsonSchema[]) {
                content.push(schemaToJson(schema));
            }
        } else if (typeof jsonSchema.contents[i] === "object") {
            content = schemaToJson(jsonSchema.contents[i] as JsonSchema);
        } else {
            content = jsonSchema.contents[i];
        }
        json[jsonSchema.keys[i]] = content;
    }
    return json;
}
