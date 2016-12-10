import {Component, ViewContainerRef} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs';

import {openDialog} from '../util/md-dialog';
import {StoreService} from '../state/store.service';

import {ProjectService} from './project.service';
import {changeCollisionTypesAction} from './project';

/**
 * Dialog to allow the user to manager their collision types
 */
@Component({
    selector: "dk-edit-collision-types",
    styleUrls: ["./duckling/layout.css"],
    template: `
        <dk-section headerText="Current Collision Types">
            <md-list>
                <md-list-item
                    *ngFor="let collisionType of collisionTypes">
                    {{collisionType}}
                </md-list-item>
            </md-list>
        </dk-section>
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
    `
})
export class EditCollisionTypesComponent {

    /**
     * Open a dialog and return an observable that resolves to the name of the map to open.
     */
    static open(viewContainer : ViewContainerRef) : Observable<String> {
        return openDialog<string>(viewContainer, EditCollisionTypesComponent);
    }

    newCollisionType : string = "";

    constructor(private _project : ProjectService,
                private _storeService : StoreService,
                private _dialogRef : MdDialogRef<EditCollisionTypesComponent>) {
    }

    createCollisionType() {
        if (this.newCollisionTypeIsValid()) {
            this._storeService.dispatch(changeCollisionTypesAction(this.collisionTypes.concat([this.newCollisionType])));
        }
    }

    newCollisionTypeIsValid() {
        return this.newCollisionType !== "" && this.collisionTypes.indexOf(this.newCollisionType) === -1;
    }

    get collisionTypes() : string[] {
        return this._project.project.getValue().collisionTypes;
    }
}
