import {Injectable} from '@angular/core';
import {loader, Texture} from 'pixi.js';
import {BehaviorSubject} from 'rxjs';
import {load as webFontLoader} from 'webfontloader';

import {AttributeKey, Entity} from '../entitysystem';
import {StoreService} from '../state/store.service';
import {PathService} from '../util/path.service';

import {RequiredAssetService} from './required-asset.service';

export type AssetType = "TexturePNG" | "FontTTF";

export interface Asset {
    type : AssetType,
    key : string
};
export interface LoadingAsset {
    asset: Asset;
    filePath?: string;
    editorSpecific?: boolean;
}
export type AssetMap = {[key: string] : Asset};

const EDITOR_SPECIFIC_IMAGE_PREFIX = "DUCKLING_PRELOADED_IMAGE__";

@Injectable()
export class AssetService {
    constructor(private _store : StoreService,
                private _path : PathService,
                private _requiredAssets : RequiredAssetService) {
        loader.on('progress', (loader : any, resource : any) => this._onAssetLoaded(resource.name));
        loader.once('complete', () => this._onLoaderComplete());
    }

    private _assets : {[key : string] : Asset} = {};
    private _loadedAssets : {[key : string] : boolean} = {};
    private _assetsToLoad : {[key: string] : LoadingAsset} = {};
    private _preloadedImagesLoaded : {[key : string] : boolean} = {};
    private _fontObjects : {[key : string] : any} = {};
    assetLoaded : BehaviorSubject<Asset> = new BehaviorSubject(null);
    preloadImagesLoaded : BehaviorSubject<boolean> = new BehaviorSubject(false);

    /*
     * Add a new asset into the asset service
     * @param  asset Asset to add
     * @param  filePath Optional filepath the asset is located. The default is /resources/<asset_key>.png
     * @param  editorSpecific Optional boolean that says if the resource is an editor specific resource, default is false.
     */
    add(assets : LoadingAsset[]) {
        if (loader.loading) {
            for (let assetToLoad of assets) {
                if (!this._assetsToLoad[assetToLoad.asset.key]) {
                    this._assetsToLoad[assetToLoad.asset.key] = assetToLoad;
                }
            }
        }
        
        for (let assetToLoad of assets) {
            assetToLoad.filePath = assetToLoad.filePath || this._store.getState().project.home + "/resources/" + assetToLoad.asset.key + "." + this._fileExtensionFromType(assetToLoad.asset.type);
            if (assetToLoad.editorSpecific) {
                assetToLoad.asset.key = EDITOR_SPECIFIC_IMAGE_PREFIX + assetToLoad.asset.key;
            }
            if (!this._assets[assetToLoad.asset.key]) {
                this._assets[assetToLoad.asset.key] = assetToLoad.asset;
                if (assetToLoad.asset.type === "FontTTF") {
                    this._loadFont(assetToLoad);
                } else {
                    loader.add(assetToLoad.asset.key, assetToLoad.filePath);
                }
            }
        }
        
        if (assets.length > 0) {
            loader.load();
        }
    }

    /**
     * Fonts are loaded using the webkit WebFontLoader and not the pixi loader
     */
    private _loadFont(assetToLoad : LoadingAsset) {
        let fontFamily = this.fontFamilyFromAssetKey(assetToLoad.asset.key);
        this._createFontFace(fontFamily, assetToLoad.filePath);
        webFontLoader({
            custom: {
                families: [fontFamily]
            },
            fontactive: () => this._onAssetLoaded(assetToLoad.asset.key)
        });
    }

    /**
     * Gets an asset out of the asset service
     * @param  key The asset key
     * @param  editorSpecific Optional boolean that determines if the asset is an editor specific resource, default is false.
     * @return Raw asset
     */
    get(key : string, type : AssetType, editorSpecific? : boolean) : any {
        if (editorSpecific) {
            key = EDITOR_SPECIFIC_IMAGE_PREFIX + key;
        }
        switch (type) {
            case "TexturePNG":
                return this._getTexture(key);
            case "FontTTF":
                throw new Error("Can't get fonts out of the asset service, they are loaded into the browser window");
            default:
                throw new Error("Unknown asset type: " + type);
        }
    }

    private _getTexture(key : string) : any {
        if (loader.resources[key]) {
            return loader.resources[key].texture;
        }
        return null;
    }

    private _createFontFace(fontFamilyName : string, file : string) {
        let newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode("\
            @font-face {\
                font-family: '" + fontFamilyName + "';\
                src: url('" + file + "');\
            }\
        "))
        document.head.appendChild(newStyle);;
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

    /**
     * Gets the registered font family for the given asset key.
     * Font families aren't allowed to have / in the name, so they are
     * replaced with a -
     * @param  assetKey Font asset key to get the font family for
     * @return font family
     */
    fontFamilyFromAssetKey(assetKey : string) : string {
        return assetKey.replace(/\//g, '-');
    }

    get assets() : {[key : string] : Asset} {
        return this._assets;
    }

    private _onLoaderComplete() {
        let arrayOfAssetsToLoad : LoadingAsset[] = [];
        for (let assetKey in this._assetsToLoad) {
            arrayOfAssetsToLoad.push(this._assetsToLoad[assetKey]);
        }
        this.add(arrayOfAssetsToLoad);
        this._assetsToLoad = {};
    }

    private _onAssetLoaded(assetKey : string) {
        this._loadedAssets[assetKey] = true;
        this._preloadedImagesLoaded[assetKey] = true;
        this.assetLoaded.next(this._assets[assetKey]);
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
        let assetsToLoad : LoadingAsset[] = [];
        for (let imageFile of imageFiles) {
            let asset = this._textureFromImageFile(imageFile);
            assetsToLoad.push({
                asset,
                filePath: imageFile,
                editorSpecific: true
            });
            this._preloadedImagesLoaded[EDITOR_SPECIFIC_IMAGE_PREFIX + asset.key] = false;
        }
        this.add(assetsToLoad);
    }

    private _textureFromImageFile(imageFile : string) : Asset {
        return {
            type: "TexturePNG",
            key: this._stripPreloadedImageKey(imageFile)
        };
    }

    private _stripPreloadedImageKey(imageFile : string) {
        let folderPieces = imageFile.split('/');
        let key = folderPieces[folderPieces.length - 1];
        return key.replace('.png', '');
    }

    private _fileExtensionFromType(type : AssetType) : string {
        switch (type) {
            case "TexturePNG":
                return "png";
            case "FontTTF":
                return "ttf";
            default:
                throw new Error("Unknown asset type: " + type);
        }

    }
}
