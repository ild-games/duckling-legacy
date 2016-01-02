module entityframework.map {

    /**
     * Represents an Asset that can be saved in a map file.
     */
    export interface Asset {
        type : string,
        key : string,

        createDOMElement(src : string) : HTMLElement;
    }

    export class GenericAsset implements Asset {
        type : string = "";
        key : string = "";

        constructor(type : string, key : string) {
            this.type = type;
            this.key = key;
        }

        createDOMElement(src : string) : HTMLElement {
            return null;
        }
    }

    export class PNGAsset implements Asset {
        type : string = "TexturePNG";
        key : string = "";

        constructor(key : string) {
            this.key = key;
        }

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
