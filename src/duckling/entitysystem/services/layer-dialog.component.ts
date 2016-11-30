import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    OnDestroy,
    ViewContainerRef
} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {Subscriber} from 'rxjs';

import {ProjectService} from '../../project/project.service';
import {AssetService} from '../../project/asset.service';
import {EntityLayerService, Layer} from '../../entitysystem/services/entity-layer.service';
import {DialogService} from '../../util/dialog.service';
import {PathService} from '../../util/path.service';
import {openDialog} from '../../util/md-dialog';

@Component({
    selector: 'dk-layer-dialog',
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

    static open(viewContainer : ViewContainerRef) {
        openDialog<string>(viewContainer, LayerDialogComponent);
    }

    ngAfterViewInit() {
        this._layerServiceSubscription = this._entityLayerService.hiddenLayers.subscribe(() => {
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
        this.layers.sort((a, b) => {
            let aAsInt = parseInt(a.layerName);
            let bAsInt = parseInt(b.layerName);
            let layerA = isNaN(aAsInt) ? a.layerName : aAsInt;
            let layerB = isNaN(bAsInt) ? b.layerName : bAsInt;

            if (layerA > layerB) {
                return 1;
            } else if (layerA < layerB) {
                return -1;
            }
            return 0;
        });
    }
}
