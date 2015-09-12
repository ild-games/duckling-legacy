module entityframework.map {

    /**
     * Represents an Asset that can be saved in a map file.
     */
    export interface Asset {
        type : string,
        key : string,
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
        assets : Asset[];
        entities : string[];
        systems : {[systemName : string]: System};
    }

    /**
     * GameMap is used to create a map for serializing.
     */
    export class Map implements GameMap {
        assets : Asset[];
        entities : string[];
        systems : {[systemName : string]: System};

        constructor() {
            this.assets = [];
            this.entities = [];
            this.systems = {};
        }
    }

}