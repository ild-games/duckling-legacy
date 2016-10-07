import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ViewContainerRef
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
        <div class="body">
            Yo waddup bitches?!
        </div>
    `
})
export class LayerDialogComponent {

    constructor(private _dialogRef : MdDialogRef<LayerDialogComponent>,
                private _path : PathService,
                private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService) {
    }
/*
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
    }
*/
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

}
