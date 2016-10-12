import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';

import {ProjectService, AssetService} from '../project';
import {DialogService, PathService} from '../util';

/*
export type LayerDialogResult = {
    numFrames : number,
    frameDimensions : Vector,
    imageKey : string,
}
*/
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
                        (click)="toggleLayerVisibility(layer)">
                    </dk-icon-button>
                    <dk-icon-button *ngIf="!layer.isVisible"
                        class="hidden-layer-button"
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

    @Input() layers : Layer[] = [{layerName: "layer1", isVisible: true}, {layerName: "layer2", isVisible: false}];

    constructor(private _dialogRef : MdDialogRef<LayerDialogComponent>,
                private _path : PathService,
                private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService) {
    }

    get dialogOptions() {
        return {
            defaultPath: this._project.project.home,
            properties: [
                'openFile'
            ],
            filters: [
                {name: 'Images', extensions: ['png']},
            ]
        }
    }

    toggleLayerVisibility(layer : Layer) {
        layer.isVisible = !layer.isVisible;
    }
}

class Layer {

    layerName : String;
    isVisible : Boolean;

}
