import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ProjectService } from './project.service';

/**
 * Dialog that allows user to choose a map. The result of the dialog is the map key the
 * user has chosen. The Project service has the logic used to create or load the map.
 */
@Component({
  selector: 'dk-map-select',
  styleUrls: ['../layout.scss', './map-select.component.scss'],
  template: `
    <div *ngIf="!listLoaded">
      <mat-spinner></mat-spinner>
    </div>
    <div *ngIf="listLoaded">
      <dk-section headerText="Select an Existing Map">
        <mat-nav-list>
          <mat-list-item *ngFor="let map of maps" (click)="selectMap(map)">
            <div class="map-name-container" [title]="map">
              {{ map }}
            </div>
          </mat-list-item>
        </mat-nav-list>
      </dk-section>
      <div class="new-map-name-field">
        <dk-input
          class="dk-inline"
          label="New Map Name"
          [dividerColor]="newMapNameIsValid() ? 'primary' : 'warn'"
          (inputChanged)="newMapName = $event.toString()"
        >
        </dk-input>
        <dk-icon-button
          icon="plus"
          tooltip="Create the map"
          [disabled]="!newMapNameIsValid()"
          (click)="createMap()"
        >
        </dk-icon-button>
      </div>
    </div>
  `,
})
export class MapSelectComponent {
  listLoaded: boolean = false;
  maps: string[] = [];
  newMapName: string = '';

  constructor(
    private _project: ProjectService,
    private _dialogRef: MatDialogRef<MapSelectComponent>
  ) {}

  ngOnInit() {
    this._project.getMaps().then((maps) => {
      this.maps = maps;
      this.listLoaded = true;
    });
  }

  onCancel() {
    this._dialogRef.close(null);
  }

  selectMap(mapName: string) {
    this._dialogRef.close(mapName);
  }

  createMap() {
    if (this.newMapNameIsValid()) {
      this.selectMap(this.newMapName);
    }
  }

  newMapNameIsValid() {
    return this.newMapName !== '' && this.maps.indexOf(this.newMapName) === -1;
  }
}
