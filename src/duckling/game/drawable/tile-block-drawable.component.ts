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

import {TileBlockDrawable} from './tile-block-drawable';

@Component({
    selector: "dk-tile-block-drawable",
    template: `
        <dk-vector-input
            xLabel="Size Width"
            yLabel="Size Height"
            [xDisabled]="!tileBlockDrawable.textureKey"
            [yDisabled]="!tileBlockDrawable.textureKey"
            [xValidator]="sizeXValidator"
            [yValidator]="sizeYValidator"
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
            this.drawableChanged.emit(immutableAssign(this.tileBlockDrawable, {
                textureKey: imageKey,
                size: this._getStartingSize(this._getAssetDimensions(asset))
            }));
        } else {
            this._dialog.showErrorDialog(
                "Unable to load tile block image",
                "A tile block's image must be the same width and height and the dimensions must be a power of 2 (ex: 64x64)");
        }
    }

    onSizeInput(newSize : Vector) {
        this.drawableChanged.emit(immutableAssign(this.tileBlockDrawable, {size: newSize}));
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

    get sizeXValidator() : Validator {
        return (value : string) => {
            if (!this.tileBlockDrawable.textureKey) {
                return true;
            }
            
            return parseInt(value) % this._tileWidth === 0;
        }
    }
    
    get sizeYValidator() : Validator {
        return (value : string) => {
            if (!this.tileBlockDrawable.textureKey) {
                return true;
            }
            
            return parseInt(value) % this._tileHeight === 0;
        }
    }

    private get _tileWidth() : number {
        if (!this.tileBlockDrawable.textureKey) {
            return 0;
        }
        
        let width = this._getAssetDimensions({key: this.tileBlockDrawable.textureKey, type: "TexturePNG"}).width;
        return width / 4;
    }

    private get _tileHeight() : number {
        if (!this.tileBlockDrawable.textureKey) {
            return 0;
        }
        
        let height = this._getAssetDimensions({key: this.tileBlockDrawable.textureKey, type: "TexturePNG"}).height;
        return height / 4;
    }
}
