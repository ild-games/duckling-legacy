import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ViewContainerRef
} from '@angular/core';
import {MdDialogConfig, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs';

import {Vector} from '../../math';
import {ProjectService, AssetService} from '../../project';
import {DialogService} from '../../util';
import {openDialog} from '../../util/md-dialog';

export type AutoCreateDialogResult = {
    numFrames : number,
    frameDimensions : Vector,
    imageKey : string,
}
<<<<<<< HEAD

@Component({
    selector: 'dk-auto-create-a<<<<<<< HEAD
nimation-dialog',
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
                md-button
                type="button"
                (click)="onAcceptClicked()">
                Accept
            </button>
            <button
                md-button
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

    static open(viewContainer : ViewContainerRef) : Observable<AutoCreateDialogResult> {
        return openDialog<AutoCreateDialogResult>(viewContainer, AutoCreateAnimationDialogComponent);
    }

    constructor(private _dialogRef : MdDialogRef<AutoCreateAnimationDialogComponent>,
<<<<<<< HEAD
=======
                private _path : PathService,
>>>>>>> fa8b191... get basic functionality down for auto creation of animation from tilesheet
                private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService) {
    }

    onAcceptClicked() {
        let result : AutoCreateDialogResult = {
            numFrames: this.numFrames,
            frameDimensions: this.frameDimensions,
            imageKey: this.imageKey
        };
        this._dialogRef.close(result);
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

    onImageFilePicked(newImageKey : string) {
<<<<<<< HEAD
        this._assets.add({type: "TexturePNG", key: newImageKey});
        this.imageKey = newImageKey;
=======
        let homeResourceString = this._path.join(this._project.project.home, 'resources');
        if (newImageKey.indexOf(homeResourceString) === -1) {
            this._dialog.showErrorDialog(
                "Unable to load image asset",
                "You must select assets from the resources/ folder in the root of your project");
            return;
        }
        let splitImageKey = newImageKey.split(homeResourceString + this._path.folderSeparator)[1].replace(/\.[^/.]+$/, "");
        this._assets.add({type: "TexturePNG", key: splitImageKey});
        this.imageKey = splitImageKey;
>>>>>>> fa8b191... get basic functionality down for auto creation of animation from tilesheet
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
