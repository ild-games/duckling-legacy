import {Injectable} from '@angular/core';
import {loader, Texture} from 'pixi.js';
import {BehaviorSubject} from 'rxjs';

import {StoreService} from '../state';

export type AssetType = "TexturePNG" | "FontTTF" | "TextureJPEG";

export interface Asset {
    type : AssetType,
    key : string
}

@Injectable()
export class AssetService {
    constructor(private _store : StoreService) {
    }

    private _assets : {[key : string] : Asset} = {};
    assetLoaded : BehaviorSubject<boolean> = new BehaviorSubject(false);

    add(asset : Asset) {
        if (!this._assets[asset.key]) {
            this._assets[asset.key] = asset;
        }
    }

    get(key : string) : any {
        if (loader.resources[key]) {
            return loader.resources[key].texture;
        } else {
            loader
                .add(key, this._store.getState().project.home + "/resources/" + key + ".png")
                .after(() => this.onAssetLoaded())
                .load();
            return null;
        }
    }

    get assets() : {[key : string] : Asset} {
        return this._assets;
    }

    onAssetLoaded() {
        this.assetLoaded.next(true);
    }
}
