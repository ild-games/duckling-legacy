import {Injectable} from '@angular/core';
import {loader, Texture} from 'pixi.js';
import {BehaviorSubject} from 'rxjs';

import {AttributeKey, Entity} from '../entitysystem';
import {StoreService} from '../state/store.service';
import {PathService} from '../util/path.service';

import {RequiredAssetService} from './required-asset.service';

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
                private _path : PathService,
                private _requiredAssets : RequiredAssetService) {
    }

    private _assets : {[key : string] : Asset} = {};
    private _loadedAssets : {[key : string] : boolean} = {};
    assetLoaded : BehaviorSubject<Asset> = new BehaviorSubject(null);

    add(asset : Asset, filePath? : string, editorSpecific? : boolean) {
        filePath = filePath || this._store.getState().project.home + "/resources/" + asset.key + ".png";
        if (editorSpecific) {
            asset.key = EDITOR_SPECIFIC_IMAGE_PREFIX + asset.key;
        }
        if (!this._assets[asset.key]) {
            this._assets[asset.key] = asset;
            loader.once('complete', () => this.onAssetLoaded(asset));
            loader
                .add(asset.key, filePath)
                .load();
        }
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
        return this._loadedAssets[key];
    }

    /**
     * Determines if all the assets for a given entity and attribute are loaded
     * @param  entity Entity to check
     * @param  attributeKey Attribute key for the attribute the assets are for
     * @return true if all the assets are loaded, otherwise false
     */
    areAssetsLoaded(entity : Entity, attributeKey : AttributeKey) {
        let requiredAssets = this._requiredAssets.assetsForAttribute(attributeKey, entity);
        let needsLoading = false;
        for (let assetKey in requiredAssets) {
            if (!this.isLoaded(assetKey)) {
                return false;
            }
        };
        return true;
    }

    get assets() : {[key : string] : Asset} {
        return this._assets;
    }

    onAssetLoaded(asset : Asset) {
        setTimeout(() => {
            this._loadedAssets[asset.key] = true;
            this.assetLoaded.next(asset);
        }, 5000);
    }
}
