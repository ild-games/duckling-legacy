module entityframework.map {

    /**
     * Represents an Asset that can be saved in a map file.
     */
    export interface Asset {
        type : string,
        key : string,
    }

    /**
     * A generic asset that describes a resource managed by the editor.
     */
    export class GenericAsset implements Asset {
        type : string = "";
        key : string = "";

        constructor(type : string, key : string) {
            this.type = type;
            this.key = key;
        }

        /**
         * Returns nothing, a generic asset doesn't know what to create.
         * @param  {string}      src Source of the element on the file system.
         * @return {HTMLElement}     HTMLElement made from the file.
         */
        createDOMElement(src : string) : HTMLElement {
            throw new Error("Unsupported");
        }
    }

    /**
     * An asset for .PNG files.
     */
    export class PNGAsset extends GenericAsset {
        constructor(key : string) {
            super("TexturePNG", key);
        }

        /**
         * Returns an HTMLImageElement with the image being the image specified by src.
         * @param  {string}      src Source of the element on the file system.
         * @return {HTMLElement}     HTMLImageElement made from the file.
         */
        createDOMElement(src : string) : HTMLElement {
            var obj = document.createElement("img");
            obj.src = src;
            return obj;
        }
    }

    /**
     * Represents a basic System that can be saved in a map file.
     */
    export interface System {
        components : framework.observe.ObservableMap<any>;
    }

    /**
     * Represents the contents of a map file.
     */
    export interface GameMap {
        key : string,
        assets : Array<Asset>;
        entities : string[];
        systems : {[systemName : string]: System};
    }

    /**
     * GameMap is used to create a map for serializing.
     */
    export class Map implements GameMap {
        key : string;
        assets : Array<Asset>;
        entities : string[];
        systems : {[systemName : string]: System};

        constructor() {
            this.key = "";
            this.assets = [];
            this.entities = [];
            this.systems = {};
        }
    }

}
