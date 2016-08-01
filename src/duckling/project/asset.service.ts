import {Injectable} from '@angular/core';
import {loader, Texture} from 'pixi.js';
import {BehaviorSubject} from 'rxjs';

import {StoreService} from '../state';

export type AssetType = "TexturePNG" | "FontTTF" | "TextureJPEG";

export interface Asset {
    type : AssetType,
    key : string
};
export type AssetMap = {[key: string] : Asset};

@Injectable()
export class AssetService {
    constructor(private _store : StoreService) {
    }

    private _assets : {[key : string] : Asset} = {};
    assetLoaded : BehaviorSubject<boolean> = new BehaviorSubject(false);

    add(asset : Asset) {
        if (!this._assets[asset.key]) {
            this._assets[asset.key] = asset;
            loader
                .add(asset.key, this._store.getState().project.home + "/resources/" + asset.key + ".png")
                .after(() => this.onAssetLoaded(asset))
                .load();
        }
    }

    get(key : string) : any {
        if (loader.resources[key]) {
            return loader.resources[key].texture;
        }
        return null;
    }

    isLoaded(key : string) : boolean {
        if (loader.resources[key]) {
            return true;
        }
        return false;
    }

    get assets() : {[key : string] : Asset} {
        return this._assets;
    }

    onAssetLoaded(asset : Asset) {
        this.assetLoaded.next(true);
    }
}
