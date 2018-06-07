import {
    Component, 
    ViewContainerRef,
    ElementRef,
    ViewChild,
    AfterViewInit
}  from '@angular/core';
import {MatDialogRef} from '@angular/material';

import {ProjectService} from './project.service';


@Component({
    selector: "dk-minify-all-maps",
    styleUrls: [
        "./duckling/project/minify-all-maps.component.css"
    ],
    template: `
        <div class="container">
            <div>Currently minifying: {{curMapName}}</div>
            <mat-progress-bar
                color="primary"
                mode="determinate"
                [value]="progressBarValue">
            </mat-progress-bar>
        </div>
    `
})
export class MinifyAllMapsComponent {
    private _curMapName = "";
    private _curMapIndex = 0;
    private _numMaps = 0;

    constructor(
        private _project : ProjectService,
        private _dialogRef : MatDialogRef<MinifyAllMapsComponent>) {
    }

    ngAfterViewInit() {
        this._minifyAllMaps().then(() => {
            this._dialogRef.close(null);
        });
    }

    async _minifyAllMaps() {
        let maps = await this._project.getMaps();
        this._numMaps = maps.length;
        for (let map of maps) {
            this._curMapIndex++;
            this._curMapName = map;
            await this._project.openMap(map);
            await this._project.save(true);
        }
    }

    get curMapName() : string {
        return this._curMapName;
    }

    get progressBarValue() : number {
        return (this._curMapIndex / this._numMaps) * 100;
    }
}
