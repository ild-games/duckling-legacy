import {Injectable} from '@angular/core';
import {loader, Texture} from 'pixi.js';
import {BehaviorSubject} from 'rxjs';
import * as WebFont from 'webfontloader';
let opentype = require('opentype.js');

import {AttributeKey, Entity} from '../entitysystem';
import {StoreService} from '../state/store.service';
import {PathService} from '../util/path.service';

import {RequiredAssetService} from './required-asset.service';

export type AssetType = "TexturePNG" | "FontTTF";

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
    private _fontObjects : {[key : string] : any} = {};
    assetLoaded : BehaviorSubject<Asset> = new BehaviorSubject(null);
    preloadImagesLoaded : BehaviorSubject<boolean> = new BehaviorSubject(false);

    /*
     * Add a new asset into the asset service
     * @param  asset Asset to add
     * @param  filePath Optional filepath the asset is located. The default is /resources/<asset_key>.png
     * @param  editorSpecific Optional boolean that says if the resource is an editor specific resource, default is false.
     */
    add(asset : Asset, filePath? : string, editorSpecific? : boolean) {
        filePath = filePath || this._store.getState().project.home + "/resources/" + asset.key + "." + this._fileExtensionFromType(asset.type);
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
    get(key : string, type : AssetType, editorSpecific? : boolean) : any {
        if (editorSpecific) {
            key = EDITOR_SPECIFIC_IMAGE_PREFIX + key;
        }
        switch (type) {
            case "TexturePNG":
                return this._getTexture(key);
            case "FontTTF":
                return this._getFont(key);
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

    private _getFont(key : string) : any {
        if (this._fontObjects[key]) {
            return this._fontObjects[key];
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

    get assets() : {[key : string] : Asset} {
        return this._assets;
    }

    private _onAssetLoaded(asset : Asset, editorSpecific : boolean) {
        this._postAssetLoadAction(asset).then(() => {
            this._loadedAssets[asset.key] = true;
            this._preloadedImagesLoaded[asset.key] = true;
            this.assetLoaded.next(asset);
            if (this._allPreloadedImagesLoaded()) {
                this.preloadImagesLoaded.next(true);
            }
        });
    }

    private _postAssetLoadAction(asset : Asset) : Promise<any> {
        if (asset.type === "FontTTF") {
            return this._loadFont(asset);
        }
        return new Promise<any>(resolve => resolve());
    }

    private _loadFont(asset : Asset) : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let file = this._store.getState().project.home + "/resources/" + asset.key + "." + this._fileExtensionFromType(asset.type);
            opentype.load(file, (err : any, font : any) => {
                if (err) {
                    reject(err);
                }
                this._fontObjects[asset.key] = font;
                this._createFontFace(font.names.fontFamily.en, file);
                WebFont.load({
                    custom: {
                        families: [font.names.fontFamily.en]
                    },
                    fontactive: () => resolve()
                })
            });
        });
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
