import {Injectable} from '@angular/core';
import {loader, Texture} from 'pixi.js';
import {BehaviorSubject} from 'rxjs';

import {AttributeKey, Entity} from '../entitysystem';
import {StoreService} from '../state/store.service';
import {PathService} from '../util/path.service';

import {RequiredAssetService} from './required-asset.service';

export type AssetType = "TexturePNG";

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
    private _preloadedImagesLoaded : {[key : string] : boolean} = {};
    assetLoaded : BehaviorSubject<Asset> = new BehaviorSubject(null);
    preloadImagesLoaded : BehaviorSubject<boolean> = new BehaviorSubject(false);

    /**
     * Add a new asset into the asset service
     * @param  asset Asset to add
     * @param  filePath Optional filepath the asset is located. The default is /resources/<asset_key>.png
     * @param  editorSpecific Optional boolean that says if the resource is an editor specific resource, default is false.
     */
    add(asset : Asset, filePath? : string, editorSpecific? : boolean) {
        filePath = filePath || this._store.getState().project.home + "/resources/" + asset.key + ".png";
        if (editorSpecific) {
            asset.key = EDITOR_SPECIFIC_IMAGE_PREFIX + asset.key;
        }
        if (!this._assets[asset.key]) {
            this._assets[asset.key] = asset;
            loader.once('complete', () => this._onAssetLoaded(asset, editorSpecific));
            loader
                .add(asset.key, filePath)
                .load();
        }
    }

    /**
     * Gets an asset out of the asset service
     * @param  key The asset key
     * @param  editorSpecific Optional boolean that determines if the asset is an editor specific resource, default is false.
     * @return Raw asset
     */
    get(key : string, editorSpecific? : boolean) : any {
        if (editorSpecific) {
            key = EDITOR_SPECIFIC_IMAGE_PREFIX + key;
        }
        if (loader.resources[key]) {
            return loader.resources[key].texture;
        }
        return null;
    }

    /**
     * Determines if a given asset has finished loading
     * @param  key Key of the asset to chec
     * @return true if the asset has been loaded, otherwise false.
     */
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

    /**
     * Load the images that are used by the internal editor
     */
    loadPreloadedEditorImages() {
        this._path.walk("resources/images/preloaded-editor").then((files : string[]) => {
            this._preloadEditorImages(files)
        });
    }

    get assets() : {[key : string] : Asset} {
        return this._assets;
    }

    private _onAssetLoaded(asset : Asset, editorSpecific : boolean) {
        this._loadedAssets[asset.key] = true;
        this._preloadedImagesLoaded[asset.key] = true;
        this.assetLoaded.next(asset);
        if (this._allPreloadedImagesLoaded()) {
            this.preloadImagesLoaded.next(true);
        }
    }

    private _allPreloadedImagesLoaded() {
        let allLoaded = true;
        for (let key in this._preloadedImagesLoaded) {
            allLoaded = this._preloadedImagesLoaded[key];
        }
        return allLoaded;
    }

    private _preloadEditorImages(imageFiles : string[]) {
        for (let imageFile of imageFiles) {
            let asset = this._textureFromImageFile(imageFile);
            this._preloadedImagesLoaded[EDITOR_SPECIFIC_IMAGE_PREFIX + asset.key] = false;
            this.add(asset, imageFile, true);
        }
    }

    private _textureFromImageFile(imageFile : string) : Asset {
        return {
            type: "TexturePNG",
            key: this._stripPreloadedImageKey(imageFile)
        };
    }

    private _stripPreloadedImageKey(imageFile : string) {
        let folderPieces = imageFile.split(this._path.folderSeparator);
        let key = folderPieces[folderPieces.length - 1];
        return key.replace('.png', '');
    }
}
