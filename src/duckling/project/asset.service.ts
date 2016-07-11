import {Injectable} from '@angular/core';
import {loader} from 'pixi.js';


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

    private _loadedAssets : {[key : string] : any};
    private _assets : Asset[] = [];

    add(asset : Asset) {
        this._assets.push(asset);
    }

    get(key : string) : any {
        if (loader.resources[key]) {
            return loader.resources[key].texture;
        } else {
            loader.add(key, this._store.getState().project.home + "/resources/" + key + ".png");
            loader.load();
            return null;
        }
    }


    get assets() : Asset[] {
        return this._assets;
    }
}
