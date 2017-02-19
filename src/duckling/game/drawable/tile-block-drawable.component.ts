import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy
} from '@angular/core';
import {Subscriber} from 'rxjs';
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
export class TileBlockDrawableComponent implements OnInit, OnDestroy {
    @Input() tileBlockDrawable : TileBlockDrawable;
    @Output() drawableChanged = new EventEmitter<TileBlockDrawable>();

    private _assetServiceSubscription : Subscriber<any>;
    private _pickedAssetKey : string = "";

    constructor(private _dialog : DialogService,
                private _assets : AssetService,
                private _project : ProjectService) {
    }

    ngOnInit() {
        this._assetServiceSubscription = this._assets.assetLoaded.subscribe(asset => this._onAssetLoaded(asset)) as Subscriber<any>;
    }

    ngOnDestroy() {
        this._assetServiceSubscription.unsubscribe();
    }

    onImageFilePicked(imageKey : string) {
        this._pickedAssetKey = imageKey;
        this._assets.add([{asset: {type: "TexturePNG", key: imageKey}}]);
    }

    private _onAssetLoaded(asset : Asset) {
        if (!this._pickedAssetKey || this._pickedAssetKey === "" || asset.key !== this._pickedAssetKey) {
            return;
        }
        
        if (this._validDimension(this._assets.getImageAssetDimensions(asset))) {
            this.drawableChanged.emit(immutableAssign(this.tileBlockDrawable, {
                textureKey: asset.key,
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
        if (!this.tileBlockDrawable.textureKey) {
            return {x: 10, y: 10};
        }
        
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
