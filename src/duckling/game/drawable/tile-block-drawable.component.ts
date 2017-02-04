import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {DialogService} from '../../util/dialog.service';
import {immutableAssign} from '../../util/model';
import {AssetService} from '../../project/asset.service';
import {ProjectService} from '../../project/project.service';
import {Vector} from '../../math/vector';

import {TileBlockDrawable} from './tile-block-drawable';

@Component({
    selector: "dk-tile-block-drawable",
    template: `
        <dk-vector-input
            xLabel="Size Width"
            yLabel="Size Height"
            [value]="tileBlockDrawable.size"
            (validInput)="onSizeInput($event)">
        </dk-vector-input>
        
        <dk-browse-asset
            [dialogOptions]="dialogOptions"
            [selectedFile]="tileBlockDrawable.textureKey"
            (filePicked)="onImageFilePicked($event)">
        </dk-browse-asset>
    `
})
export class TileBlockDrawableComponent {
    @Input() tileBlockDrawable : TileBlockDrawable;
    @Output() drawableChanged = new EventEmitter<TileBlockDrawable>();

    constructor(private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService) {
    }

    onImageFilePicked(imageKey : string) {
        this._assets.add({type: "TexturePNG", key: imageKey});
        this.drawableChanged.emit(immutableAssign(this.tileBlockDrawable, {textureKey: imageKey}));
    }

    onSizeInput(newSize : Vector) {
        this.drawableChanged.emit(immutableAssign(this.tileBlockDrawable, {size: newSize}));
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
