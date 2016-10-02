import {Injectable} from '@angular/core';
import {loader, Texture} from 'pixi.js';
import {BehaviorSubject} from 'rxjs';

import {StoreService} from '../state';
import {PathService} from '../util';

export type AssetType = "TexturePNG" | "FontTTF" | "TextureJPEG";

export interface Asset {
    type : AssetType,
    key : string
};
export type AssetMap = {[key: string] : Asset};

const EDITOR_SPECIFIC_IMAGE_PREFIX = "DUCKLING_PRELOADED_IMAGE__";

@Injectable()
export class AssetService {
    constructor(private _store : StoreService,
                private _path : PathService) {
    }

    private _assets : {[key : string] : Asset} = {};
    assetLoaded : BehaviorSubject<boolean> = new BehaviorSubject(false);

    add(asset : Asset, filePath? : string, editorSpecific? : boolean) {
        filePath = filePath || this._store.getState().project.home + "/resources/" + asset.key + ".png";
        if (editorSpecific) {
            asset.key = EDITOR_SPECIFIC_IMAGE_PREFIX + asset.key;
        }
        this._path.pathExists(filePath).then((exists : boolean) => {
            if (!exists) {
                return;
            }

            if (!this._assets[asset.key]) {
                this._assets[asset.key] = asset;
                loader
                    .add(asset.key, filePath)
                    .after(() => this.onAssetLoaded(asset))
                    .load();
            }
        });
    }

    get(key : string, editorSpecific? : boolean) : any {
        if (editorSpecific) {
            key = EDITOR_SPECIFIC_IMAGE_PREFIX + key;
        }
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
