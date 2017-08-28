import {Component, ViewContainerRef} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs';

import {StoreService} from '../../state/store.service';
import {ProjectService} from '../../project/project.service';

import {CollisionTypesService} from './collision-types.service';

/**
 * Dialog to allow the user to manager their collision types
 */
@Component({
    selector: "dk-edit-collision-types",
    styleUrls: ["./duckling/layout.css", "./duckling/game/collision/edit-collision-types.component.css"],
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
            <md-list class="current-collision-types">
                <md-list-item
                    *ngFor="let collisionType of collisionTypes">
                    {{collisionType}}
                </md-list-item>
            </md-list>
        </dk-section>
    `
})
export class EditCollisionTypesComponent {

    newCollisionType : string = "";

    constructor(private _collisionTypes : CollisionTypesService,
                private _storeService : StoreService,
                private _dialogRef : MdDialogRef<EditCollisionTypesComponent>) {
    }

    createCollisionType() {
        if (this.newCollisionTypeIsValid()) {
            this._collisionTypes.addCollisionType(this.newCollisionType);
        }
    }

    newCollisionTypeIsValid() {
        return this.newCollisionType !== "" && this.collisionTypes.indexOf(this.newCollisionType) === -1;
    }

    get collisionTypes() : string[] {
        return Array.from(this._collisionTypes.collisionTypes.getValue().values());
    }
}
