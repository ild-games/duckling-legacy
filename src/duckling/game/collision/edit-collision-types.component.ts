import {Component, ViewContainerRef} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs';

import {StoreService} from '../../state/store.service';
import {ProjectService} from '../../project/project.service';
import {Validator} from '../../controls/validated-input.component';

import {CollisionTypesService} from './collision-types.service';
import {EDIT_COLLISION_TYPE_MIGRATION_NAME} from './collision-migration';

/**
 * Dialog to allow the user to manager their collision types
 */
@Component({
    selector: "dk-edit-collision-types",
    styleUrls: [
        "./duckling/layout.css", 
        "./duckling/game/collision/edit-collision-types.component.css"
    ],
    template: `
        <dk-section headerText="Create Collision Type">
            <div>
                <dk-input class="dk-inline"
                    label="New Collision Type"
                    [dividerColor]="newCollisionTypeIsValid() ? 'primary' : 'warn'"
                    (inputChanged)="newCollisionType = $event">
                </dk-input>
                <dk-icon-button
                    icon="save"
                    tooltip="Create the collision type"
                    [disabled]="!newCollisionTypeIsValid()"
                    (click)="createCollisionType()">
                </dk-icon-button>
            </div>
        </dk-section>
        <dk-section headerText="Current Collision Types">
            <mat-list class="current-collision-types">
                <dk-edit-input
                    *ngFor="let collisionType of collisionTypes"
                    [value]="collisionType"
                    [validator]="collisionTypeValidator(collisionType)"
                    [floatIconRight]="true"
                    editTooltip="Edit collision type"
                    validTooltip="Save collision type"
                    invalidTooltip="Collision type cannot be a duplicate or blank"
                    (onValueSaved)="onCollisionTypeModified(collisionType, $event)">
                </dk-edit-input>
            </mat-list>
        </dk-section>
    `
})
export class EditCollisionTypesComponent {

    newCollisionType : string = "";

    constructor(private _collisionTypes : CollisionTypesService,
                private _storeService : StoreService,
                private _dialogRef : MatDialogRef<EditCollisionTypesComponent>,
                private _projectService : ProjectService) {
    }

    createCollisionType() {
        if (this.newCollisionTypeIsValid()) {
            this._collisionTypes.addCollisionType(this.newCollisionType);
        }
    }

    newCollisionTypeIsValid() : boolean {
        return this.newCollisionType !== "" && this.collisionTypes.indexOf(this.newCollisionType) === -1;
    }

    onCollisionTypeModified(oldValue : string, newValue : string) {
        this._collisionTypes.editCollisionType(oldValue, newValue);
        this._projectService.runExistingCodeMigration(
            EDIT_COLLISION_TYPE_MIGRATION_NAME, 
            {
                oldType: oldValue, 
                newType: newValue
            });
    }

    get collisionTypes() : string[] {
        return Array.from(this._collisionTypes.collisionTypes.getValue().values());
    }

    collisionTypeValidator(currentEditingType : string) : Validator {
        return (value : string) => {
            if (!value || value === "") {
                return false;
            }
            if (value === currentEditingType) {
                return true;
            }

            return this.collisionTypes.indexOf(value) === -1;
        }
    }
}

