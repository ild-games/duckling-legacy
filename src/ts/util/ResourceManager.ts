///<reference path="../framework/Context.ts" />
module util.resource {

    @framework.ContextKey("util.resource.ResourceManager")
    export class ResourceManager {
        private _resources : {[type : string] : {[key : string] : any}} = {};
        private numAssetsLoaded : number = 0;
        private numAssetsToLoad : number = 0;
        private isFinishedLoading : boolean = false;

        addAsset(asset : entityframework.map.Asset, loadedObj : any) {
            if (!this._resources[asset.type]) {
                this._resources[asset.type] = {};
            }
            if (!this._resources[asset.type][asset.key]) {
                this._resources[asset.type][asset.key] = loadedObj;
            }
        }

        hasAsset(asset : entityframework.map.Asset) : boolean {
            return this._resources[asset.type] && this._resources[asset.type][asset.key];
        }

        getResource(asset : entityframework.map.Asset) : any {
            if (!this.hasAsset(asset)) {
                return null;
            }

            return this._resources[asset.type][asset.key];
        }

        createAssetDOMElement(asset : entityframework.map.Asset, baseSrc : string) : HTMLElement {
            var obj = null;
            var src = baseSrc;
            switch (asset.type) {
                case "TexturePNG":
                    src += "/resources/" + asset.key + ".png";
                    obj = new entityframework.map.PNGAsset(asset.key).createDOMElement(src);
                    break;
            }
            return obj;
        }

        loadAsset(asset : entityframework.map.Asset, rootPath : string) : Promise<any> {
            return new Promise<any>((resolve) => {
                var obj = this.createAssetDOMElement(asset, rootPath);
                if (obj != null) {
                    obj.onload = resolve;
                    this.addAsset(asset, obj);
                }
            });
        }

        loadAssets(assets : Array<entityframework.map.Asset>, rootPath : string) {
            this.numAssetsToLoad = assets.length;
            var assetPromises : Array<Promise<any>> = [];

            assets.forEach((asset : entityframework.map.Asset) => {
                assetPromises.push(this.loadAsset(asset, rootPath))
            });
            Promise.all(assetPromises).then(() => this.isFinishedLoading = true);
        }

        areAllAssetsLoaded() : boolean {
            return this.isFinishedLoading;
        }
    }
}
