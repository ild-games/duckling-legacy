import {
    Component,
    ViewContainerRef,
    ElementRef,
    ViewChild,
    AfterViewInit,
} from "@angular/core";
import { MatDialogRef } from "@angular/material";

import { ProjectService } from "./project.service";

@Component({
    selector: "dk-migrate-all-maps",
    styleUrls: ["./duckling/project/migrate-all-maps.component.css"],
    template: `
        <div class="container">
            <div>Currently migrating: {{curMapName}}</div>
            <mat-progress-bar
                color="primary"
                mode="determinate"
                [value]="progressBarValue">
            </mat-progress-bar>
        </div>
    `,
})
export class MigrateAllMapsComponent {
    private _curMapName = "";
    private _curMapIndex = 0;
    private _numMaps = 0;

    constructor(
        private _project: ProjectService,
        private _dialogRef: MatDialogRef<MigrateAllMapsComponent>
    ) {}

    ngAfterViewInit() {
        this._migrateAllMaps().then(() => {
            this._dialogRef.close(null);
        });
    }

    async _migrateAllMaps() {
        let maps = await this._project.getMaps();
        this._numMaps = maps.length;
        for (let map of maps) {
            this._curMapIndex++;
            this._curMapName = map;
            await this._project.openMap(map);
            await this._project.save();
        }
    }

    get curMapName(): string {
        return this._curMapName;
    }

    get progressBarValue(): number {
        return (this._curMapIndex / this._numMaps) * 100;
    }
}
