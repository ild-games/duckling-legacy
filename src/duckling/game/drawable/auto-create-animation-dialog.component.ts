import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ViewContainerRef,
    OnInit,
    OnDestroy
} from '@angular/core';
import {MatDialogConfig, MatDialogRef} from '@angular/material';
import {Observable, Subscriber} from 'rxjs';
import {Rectangle} from 'pixi.js';

import {Vector} from '../../math';
import {ProjectService} from '../../project';
import {AssetService, Asset} from '../../project/asset.service';
import {DialogService} from '../../util';

export type AutoCreateDialogResult = {
    numFrames : number,
    frameDimensions : Vector,
    imageKey : string
}

@Component({
    selector: 'dk-auto-create-animation-dialog',
    styleUrls: ['./duckling/game/drawable/auto-create-animation-dialog.component.css'],
    template: `
        <div class="body">
            <dk-number-input
                label="Number of frames"
                [value]="numFrames"
                (validInput)="onNumFramesInput($event)">
            </dk-number-input>

            <dk-vector-input
                xLabel="Frame width"
                yLabel="Frame height"
                [value]="frameDimensions"
                (validInput)="onDimensionInput($event)">
            </dk-vector-input>

            <dk-browse-asset
                [dialogOptions]="dialogOptions"
                [selectedFile]="imageKey"
                (filePicked)="onImageFilePicked($event)">
            </dk-browse-asset>
        </div>

        <div class="footer">
            <button
                mat-button
                type="button"
                (click)="onAcceptClicked()">
                Accept
            </button>
            <button
                mat-button
                type="button"
                (click)="onCancelClicked()">
                Cancel
            </button>
        </div>
    `
})
export class AutoCreateAnimationDialogComponent {
    numFrames : number = 0;
    frameDimensions : Vector = {x: 0, y: 0};
    imageKey : string;

    private _assetServiceSubscription : Subscriber<any>;

    constructor(private _dialogRef : MatDialogRef<AutoCreateAnimationDialogComponent>,
                private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService) {
    }

    ngOnInit() {
        this._assetServiceSubscription = this._assets.assetLoaded.subscribe(asset => this._onAssetLoaded(asset)) as Subscriber<any>;
    }

    ngOnDestroy() {
        this._assetServiceSubscription.unsubscribe();
    }

    onAcceptClicked() {
        let asset : Asset = {type: "TexturePNG", key: this.imageKey};
        if (this._assets.get(asset)) {
            this._onAssetLoaded(asset);
        } else {
            this._assets.add([{asset}]);
        }
    }

    onCancelClicked() {
        this._dialogRef.close(null);
    }

    onDimensionInput(newFrameDimensions : Vector) {
        this.frameDimensions = newFrameDimensions;
    }

    onNumFramesInput(newNumFrames : number) {
        this.numFrames = newNumFrames;
    }

    onImageFilePicked(imageKey : string) {
        this.imageKey = imageKey;
    }

    private _onAssetLoaded(asset : Asset) {
        if (!this.imageKey || this.imageKey === "" || asset.key !== this.imageKey) {
            return;
        }
        
        let result : AutoCreateDialogResult = {
            numFrames: this.numFrames,
            frameDimensions: this.frameDimensions,
            imageKey: this.imageKey
        };
        this._dialogRef.close(result);
    }

    get dialogOptions() {
        return {
            defaultPath: this._project.home,
            properties: [
                'openFile'
            ],
            filters: [
                {name: 'Images', extensions: ['png']},
            ]
        }
    }

}
