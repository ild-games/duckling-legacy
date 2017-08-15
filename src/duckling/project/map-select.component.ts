import {Component, ViewContainerRef} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs';

import {ProjectService} from './project.service';

/**
 * Dialog that allows user to choose a map. The result of the dialog is the map key the
 * user has chosen. The Project service has the logic used to create or load the map.
 */
@Component({
    selector: "dk-map-select",
    styleUrls: ["./duckling/layout.css", "./duckling/project/map-select.component.css"],
    template: `
        <div *ngIf="!listLoaded">
            <md-spinner></md-spinner>
        </div>
        <div *ngIf="listLoaded">
            <dk-section 
                headerText="Select an Existing Map">
                <md-nav-list>
                    <md-list-item
                        *ngFor="let map of maps"
                        (click)="selectMap(map)">
                        <div 
                            class="map-name-container" 
                            [title]="map">
                        {{map}}
                        </div>
                    </md-list-item>
                </md-nav-list>
            </dk-section>
            <div class="new-map-name-field">
                <dk-input class="dk-inline"
                    label="New Map Name"
                    [dividerColor]="newMapNameIsValid() ? 'primary' : 'warn'"
                    (inputChanged)="newMapName = $event">
                </dk-input>
                <dk-icon-button
                    icon="plus"
                    tooltip="Create the map"
                    [disabled]="!newMapNameIsValid()"
                    (click)="createMap()">
                </dk-icon-button>
            </div>

        </div>
    `
})
export class MapSelectComponent {

    listLoaded : boolean = false;
    maps : string [] = [];
    newMapName : string = "";

    constructor(private _project : ProjectService,
                private _dialogRef : MdDialogRef<MapSelectComponent>) {
    }

    ngOnInit() {
        this._project.getMaps().then((maps) => {
            this.maps = maps;
            this.listLoaded = true;
        });
    }

    onCancel() {
        this._dialogRef.close(null);
    }

    selectMap(mapName : string) {
        this._dialogRef.close(mapName);
    }

    createMap() {
        if (this.newMapNameIsValid()) {
            this.selectMap(this.newMapName);
        }
    }

    newMapNameIsValid() {
        return this.newMapName !== "" && this.maps.indexOf(this.newMapName) === -1;
    }
}
