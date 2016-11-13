import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {Subscriber} from 'rxjs';

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
                        class="shown-layer-button"
                        tooltip="Hide layer"
                        icon="eye"
                        (iconClick)="toggleLayerVisibility(layer)">
                    </dk-icon-button>
                    <dk-icon-button *ngIf="!layer.isVisible"
                        class="hidden-layer-button"
                        tooltip="Show layer"
                        icon="eye-slash"
                        (iconClick)="toggleLayerVisibility(layer)">
                    </dk-icon-button>

                    <h2>{{layer.layerName}}</h2>
                </md-list-item>
            </md-list>
        </div>
    `
})
export class LayerDialogComponent implements AfterViewInit, OnDestroy{

    layers : Layer[] = [];

    private _layerServiceSubscription : Subscriber<any>;

    constructor(private _dialogRef : MdDialogRef<LayerDialogComponent>,
                private _path : PathService,
                private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService,
                private _entityLayerService : EntityLayerService) {
        this._refreshLayers();
    }

    ngAfterViewInit() {
        this._layerServiceSubscription = this._entityLayerService.layerChanged.subscribe(() => {
            this._refreshLayers();
        }) as Subscriber<any>;
    }

    ngOnDestroy() {
        this._layerServiceSubscription.unsubscribe;
    }

    toggleLayerVisibility(layer : Layer) {
        this._entityLayerService.toggleLayerVisibility(layer.layerName);
    }

    private _refreshLayers(){
        this.layers = Array.from(this._entityLayerService.getLayers());
    }
}
