import {Component, ViewContainerRef}  from '@angular/core';
import {Observable} from 'rxjs';

import {openDialog} from '../util/md-dialog';
import {JsonSchemaEdit, schemaEditToJson} from '../controls/json-schema-edit.component';

import {ProjectService} from './project.service';
import {CustomAttribute} from './custom-attribute';


/**
 * Component where the user can add, delete, and edit custom attributes
 */
@Component({
    selector: "dk-custom-attributes",
    styleUrls: ["./duckling/layout.css", "./duckling/project/custom-attributes.component.css"],
    template: `
        <div class="container">
            <md-card class="left-section">
                <md-card-content>
                    <md-list>
                        <md-list-item *ngFor="let attribute of customAttributes">
                            {{attribute.key}}
                        </md-list-item>
                    </md-list>
                </md-card-content>

                <md-card-actions>
                    <div class="actions">
                        <a (click)="onNewAttributeClicked()">
                            <dk-icon iconClass="file-o">
                            </dk-icon>
                            New
                        </a>
                    </div>
                </md-card-actions>
            </md-card>
            <div class="right-section">
                <dk-input
                    class="dk-inline"
                    [value]="curAddingName"
                    [dividerColor]="isValidAttributeName(curAddingName) ? 'primary' : 'warn'"
                    (inputChanged)="onAttributeNameInput($event)">
                </dk-input>
                <dk-json-schema-edit
                    [jsonSchema]="curAddingSchema"
                    (jsonSchemaChanged)="onJsonSchemaChanged($event)">
                </dk-json-schema-edit>
                <div class="adding-section-footer">
                    <button 
                        md-raised-button
                        color="primary"
                        [disabled]="!isValidAttributeName(curAddingName)"
                        (click)="onAcceptCustomAttribute()">
                        Accept
                    </button>
                </div>
            </div>
        </div>
    `
})
export class CustomAttributesComponent {

    curAddingSchema : JsonSchemaEdit = { keys: [], contents: [] };
    curAddingName : string = "";

    constructor(private _project : ProjectService) {
        
    }
     
    /**
     * Open a dialog and return an observable that resolves to the name of the map to open.
     */
    static open(viewContainer : ViewContainerRef) : Observable<String> {
        return openDialog<string>(viewContainer, CustomAttributesComponent);
    }

    onNewAttributeClicked() {
        this.curAddingName = "";
        this.curAddingSchema = {keys: [], contents: []};
    }

    onAttributeNameInput(newCurAddingName : string) {
        this.curAddingName = newCurAddingName;
    }

    onJsonSchemaChanged(newJsonSchema : JsonSchemaEdit) {
        this.curAddingSchema = newJsonSchema;
    }
    
    onAcceptCustomAttribute() {
        this._project.addCustomAttribute(this.curAddingName, schemaEditToJson(this.curAddingSchema));
        this.curAddingName = "";
        this.curAddingSchema = {keys: [], contents: []};
    }
    
    isValidAttributeName(newCurAddingName : string) : boolean {
        if (!newCurAddingName || newCurAddingName === "") {
            return false;
        }
        if (this._project.hasCustomAttribute(newCurAddingName)) {
            return false;
        }
        return true;
    }

    get customAttributes() : CustomAttribute[] {
        let projectAttribute = this._project.project.getValue().customAttributes;
        return projectAttribute ? projectAttribute : [];
    }

    get addingSectionHeader() : string {
        if (this.curAddingSchema !== undefined) {
            return this.curAddingName;
        }
        return "Nothing";
    }
}