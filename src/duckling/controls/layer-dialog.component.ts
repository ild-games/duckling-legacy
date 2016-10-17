import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';

import {ProjectService, AssetService} from '../project';
import {EntityLayerService,Layer} from '../entitysystem';
import {DialogService, PathService} from '../util';

@Component({
    selector: 'dk-layer-dialog',
    styleUrls: ['./duckling/controls/layer-dialog.component.css'],
    template: `
        <div>
            <md-list>
                <md-list-item
                *ngFor="let layer of layers">
                    <dk-icon-button *ngIf="layer.isVisible"
                        tooltip="Hide layer"
                        icon="eye"
                        (click)="console.log('hello')">
                    </dk-icon-button>
                    <dk-icon-button *ngIf="!layer.isVisible"
                        tooltip="Show layer"
                        icon="eye-slash"
                        (click)="toggleLayerVisibility(layer)">
                    </dk-icon-button>

                    <h2>{{layer.layerName}}</h2>
                </md-list-item>
            </md-list>
        </div>
    `
})
export class LayerDialogComponent {

    constructor(private _dialogRef : MdDialogRef<LayerDialogComponent>,
                private _path : PathService,
                private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService,
                private _entityLayerService : EntityLayerService) {
    }

    get layers() : Layer[] {
        return Array.from(this._entityLayerService.getLayers());
    }

    toggleLayerVisibility(layer : Layer) {
        console.log("Waddup");
        this._entityLayerService.toggleLayerVisibility(layer.layerName);
    }
}
