import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {Rectangle} from 'pixi.js';

import {DialogService} from '../../util/dialog.service';
import {immutableAssign} from '../../util/model';
import {AssetService, Asset} from '../../project/asset.service';
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

    async onImageFilePicked(imageKey : string) {
        let asset = await this._assets.add({type: "TexturePNG", key: imageKey});
        if (this._validDimension(this._getAssetDimensions(asset))) {
            this.drawableChanged.emit(immutableAssign(this.tileBlockDrawable, {textureKey: imageKey}));
        } else {
            this._dialog.showErrorDialog(
                "Unable to load tile block image",
                "A tile block's image must be the same width and height and the dimensions must be a power of 2 (ex: 64x64)");
        }
    }

    onSizeInput(newSize : Vector) {
        this.drawableChanged.emit(immutableAssign(this.tileBlockDrawable, {size: newSize}));
    }

    private _validDimension(dimension : Rectangle) : boolean {
        if (dimension.width !== dimension.height) {
            return false;
        }

        if (!Number.isInteger(Math.sqrt(dimension.width))) {
            return false;
        }

        return true;
    }
    
    private _getAssetDimensions(asset : Asset) : Rectangle {
        let texture = this._assets.get(asset);
        if (!texture) {
            return new Rectangle(0, 0, 0, 0);
        }
        return texture.frame;
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
