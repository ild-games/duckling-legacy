import 'mocha';
import {expect} from 'chai';
import "reflect-metadata";

import {createEntitySystem, mergeEntityAction} from '../../duckling/entitysystem';
import {RawMapFile, MapParserService, AssetService, RequiredAssetService} from '../../duckling/project';
import {ProjectLifecycleService} from '../../duckling/project/project-lifecycle.service';
import {StoreService} from '../../duckling/state';
import {mainReducer} from '../../duckling/main.reducer';
import {immutableAssign, PathService} from '../../duckling/util';
import {MAP_VERSION} from '../../duckling/version';

let emptyMap : RawMapFile = {
    key : "",
    entities : [],
    assets : [],
    systems : {},
    version: MAP_VERSION,
    dimension: {x: 0, y: 0},
    gridSize: 0
};

let entityA = {
    sa : {
        foo : "barea"
    }
}

let entityB = {
    sa : {
        foo : "bareb"
    },
    sb : {
        isSpecial : true
    }
}

let basicMap : RawMapFile = {
    key : "aBasicMap",
    entities : ["ea", "eb", "ec"],
    assets : [
    ],
    systems : {
        sa : {
            components : {
                ea : {
                    foo : "barea",
                },
                eb : {
                    foo : "bareb",
                },
            }
        },
        sb : {
            components : {
                eb : {
                    isSpecial : true
                }
            }
        }
    },
    version: MAP_VERSION,
    dimension: {x: 1200, y: 800},
    gridSize: 16
}

describe("MapLoaderService", function() {
    beforeEach(function() {
        let storeService = new StoreService(mainReducer, mergeEntityAction);
        let requiredAssetService = new RequiredAssetService();
        this.parser = new MapParserService(
            new AssetService(storeService, new PathService(), requiredAssetService),
            requiredAssetService,
            new ProjectLifecycleService());
    });

    it("turns an empty map into an empty system", function() {
        let parsedMap = this.parser.rawMapToParsedMap(emptyMap);
        expect(parsedMap.entitySystem.isEmpty()).to.eql(true);
    });

    it("turns an empty system into an empty map", function() {
        let map = this.parser.parsedMapToRawMap({
            entitySystem: createEntitySystem(),
            dimension: {x: 0, y: 0},
            gridSize: 0,
            key: "",
            version: ""
        });
        expect(map).to.eql(emptyMap);
    });

    describe("loading a map into an entity system", function() {
        beforeEach(function() {
            this.parsedMap = this.parser.rawMapToParsedMap(basicMap);
        });

        it("allows for the creation of empty entities", function() {
            expect(this.parsedMap.entitySystem.get("ec")).to.eql({});
        });

        it("allows for the creation of entities with a single component", function() {
            expect(this.parsedMap.entitySystem.get("ea")).to.eql(entityA);
        });

        it("allows for the creation of entities with multiple components", function() {
            expect(this.parsedMap.entitySystem.get("eb")).to.eql(entityB);
        });
    });

    it("loading and saving a map preserves the original map", function() {
        let parsedMap = this.parser.rawMapToParsedMap(basicMap);
        let map = this.parser.parsedMapToRawMap(parsedMap);
        map.entities.sort();
        expect(map).to.eql(basicMap);
    });

    it("if an entity is in a system, but not the entities array, it will create the entity", function () {
        let sa = {
            components : {
                ea : {
                    foo : "barea"
                }
            }
        };
        let map = immutableAssign(emptyMap, {systems : { sa}});
        let parsedMap = this.parser.rawMapToParsedMap(map);
        expect(parsedMap.entitySystem.get("ea")).to.eql(entityA);
    });
});
