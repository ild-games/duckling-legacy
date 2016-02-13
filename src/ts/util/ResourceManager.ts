///<reference path="../framework/Context.ts" />
module util.resource {

    /**
     * Holds the loaded in HTMLElements used by the media based components (image, audio)
     */
    @framework.ContextKey("util.resource.ResourceManager")
    export class ResourceManager {
        private _resources : {[type : string] : {[key : string] : any}} = {};
        private numAssetsLoaded : number = 0;
        private numAssetsToLoad : number = 0;
        private isFinishedLoading : boolean = false;

        /**
         * Adds a loaded resource object that is associated with a given asset.
         * @param  {entityframework.map.Asset} asset     Asset that describes the resource.
         * @param  {any}                       loadedObj HTMLElement that is the resource.
         */
        addResource(asset : entityframework.map.Asset, loadedObj : any) {
            if (!this._resources[asset.type]) {
                this._resources[asset.type] = {};
            }
            if (!this._resources[asset.type][asset.key]) {
                this._resources[asset.type][asset.key] = loadedObj;
            }
        }

        /**
         * Checks if a given asset is already contained within the Resource Manager
         * @param  {entityframework.map.Asset} asset Asset to check if it is contained.
         * @return {boolean}                         True if the asset is there, otherwise false.
         */
        hasAsset(asset : entityframework.map.Asset) : boolean {
            return this._resources[asset.type] && this._resources[asset.type][asset.key];
        }

        /**
         * Get the loaded in HTMLElement associated with the given asset.
         * @param  {entityframework.map.Asset} asset Asset describing the resource to get.
         * @return {any}                             The resource if it exists, otherwise null.
         */
        getResource(asset : entityframework.map.Asset) : any {
            if (!this.hasAsset(asset)) {
                return null;
            }

            return this._resources[asset.type][asset.key];
        }

        /**
         * Load all the given assets from the given path.
         * @param  {Array<entityframework.map.Asset>} assets   Assets to load.
         * @param  {string}                           rootPath Path the resource folder is at.
         */
        loadAssets(assets : Array<entityframework.map.Asset>, rootPath : string) : Promise<any> {
            this.isFinishedLoading = false;
            this.numAssetsToLoad = assets.length;
            var assetPromises : Array<Promise<any>> = [];

            assets.forEach((asset : entityframework.map.Asset) => {
                assetPromises.push(this.loadAsset(asset, rootPath))
            });
            return Promise.all(assetPromises).then(() => {
                this.isFinishedLoading = true;
            });
        }

        /**
         * Determines if all the resources from loadAssets are done loading.
         * @return {boolean} True if all resources are loaded, otherwise false.
         */
        areAllResourcesLoaded() : boolean {
            return this.isFinishedLoading;
        }

        private loadAsset(asset : entityframework.map.Asset, rootPath : string) : Promise<any> {
            return new Promise<any>((resolve) => {
                var obj = this.createAssetDOMElement(asset, rootPath);
                if (obj != null) {
                    obj.onload = resolve;
                    this.addResource(asset, obj);
                }
            });
        }

        private createAssetDOMElement(asset : entityframework.map.Asset, baseSrc : string) : HTMLElement {
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
    }
}
