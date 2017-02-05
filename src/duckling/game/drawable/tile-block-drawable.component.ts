import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {Rectangle} from 'pixi.js';

import {DialogService} from '../../util/dialog.service';
import {Validator} from '../../controls/validated-input.component';
import {immutableAssign} from '../../util/model';
import {AssetService, Asset} from '../../project/asset.service';
import {ProjectService} from '../../project/project.service';
import {Vector} from '../../math/vector';

import {TileBlockDrawable, getTileWidth, getTileHeight} from './tile-block-drawable';

@Component({
    selector: "dk-tile-block-drawable",
    template: `
        <dk-vector-input
            xLabel="Size Width"
            yLabel="Size Height"
            [xDisabled]="!tileBlockDrawable.textureKey"
            [yDisabled]="!tileBlockDrawable.textureKey"
            [xValidator]="sizeValidator"
            [yValidator]="sizeValidator"
            [value]="getDisplaySize()"
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
        if (this._validDimension(this._assets.getImageAssetDimensions(asset))) {
            this.drawableChanged.emit(immutableAssign(this.tileBlockDrawable, {
                textureKey: imageKey,
                size: this._getStartingSize(this._assets.getImageAssetDimensions(asset))
            }));
        } else {
            this._dialog.showErrorDialog(
                "Unable to load tile block image",
                "A tile block's image must be the same width and height and the dimensions must be a power of 2 (ex: 64x64)");
        }
    }

    onSizeInput(newSize : Vector) {
        this.drawableChanged.emit(immutableAssign(this.tileBlockDrawable, {
            size: {
                x: newSize.x * getTileWidth(this.tileBlockDrawable, this._assets),
                y: newSize.y * getTileHeight(this.tileBlockDrawable, this._assets)
            }
        }));
    }

    getDisplaySize() : Vector {
        return {
            x: this.tileBlockDrawable.size.x / getTileWidth(this.tileBlockDrawable, this._assets),
            y: this.tileBlockDrawable.size.y / getTileHeight(this.tileBlockDrawable, this._assets)
        };
    }

    private _getStartingSize(assetDimension : Rectangle) : Vector {
        return {
            x: (assetDimension.width / 4) * 6,
            y: (assetDimension.height / 4) * 6
        }
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

    get sizeValidator() : Validator {
        return (value : string) => {
            return Number.isInteger(parseInt(value)) && parseInt(value) > 0;
        }
    }
}
