import 'mocha';
import {expect} from 'chai';
import "reflect-metadata";

import {createEntitySystem, mergeEntityAction} from '../../duckling/entitysystem';
import {RawMapFile, MapParserService, AssetService, RequiredAssetService} from '../../duckling/project';
import {StoreService} from '../../duckling/state';
import {mainReducer} from '../../duckling/main.reducer';
import {immutableAssign, PathService} from '../../duckling/util';

let emptyMap : RawMapFile = {
    key : "",
    entities : [],
    assets : [],
    systems : {}
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
    }
}

describe("MapLoaderService", function() {
    beforeEach(function() {
        let storeService = new StoreService(mainReducer, mergeEntityAction);
        let requiredAssetService = new RequiredAssetService();
        this.parser = new MapParserService(
            new AssetService(storeService, new PathService(), requiredAssetService),
            requiredAssetService);
    });

    it("turns an empty map into an empty system", function() {
        let system = this.parser.mapToSystem(emptyMap);
        expect(system.isEmpty()).to.eql(true);
    });

    it("turns an empty system into an empty map", function() {
        let map = this.parser.systemToMap("", createEntitySystem());
        expect(map).to.eql(emptyMap);
    });

    describe("loading a map into an entity system", function() {
        beforeEach(function() {
            this.system = this.parser.mapToSystem(basicMap);
        });

        it("allows for the creation of empty entities", function() {
            expect(this.system.get("ec")).to.eql({});
        });

        it("allows for the creation of entities with a single component", function() {
            expect(this.system.get("ea")).to.eql(entityA);
        });

        it("allows for the creation of entities with multiple components", function() {
            expect(this.system.get("eb")).to.eql(entityB);
        });
    });

    it("loading and saving a map preserves the original map", function() {
        let system = this.parser.mapToSystem(basicMap);
        let map = this.parser.systemToMap("aBasicMap",system);
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
        let system = this.parser.mapToSystem(map);
        expect(system.get("ea")).to.eql(entityA);
    });
});
