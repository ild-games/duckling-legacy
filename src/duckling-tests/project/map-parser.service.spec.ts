import 'mocha';
import {expect} from 'chai';
import "reflect-metadata";

import {createEntitySystem, mergeEntityAction} from '../../duckling/entitysystem';
import {RawMapFile, MapParserService, AssetService, RequiredAssetService} from '../../duckling/project';
import {StoreService} from '../../duckling/state';
import {mainReducer} from '../../duckling/main.reducer';
import {immutableAssign} from '../../duckling/util';

var emptyMap : RawMapFile = {
    key : "",
    entities : [],
    assets : [],
    systems : {}
};

var entityA = {
    sa : {
        foo : "barea"
    }
}

var entityB = {
    sa : {
        foo : "bareb"
    },
    sb : {
        isSpecial : true
    }
}

var basicMap : RawMapFile = {
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
        var storeService = new StoreService(mainReducer, mergeEntityAction);
        this.parser = new MapParserService(new AssetService(storeService), new RequiredAssetService());
    });

    it("turns an empty map into an empty system", function() {
        var system = this.parser.mapToSystem(emptyMap);
        expect(system.isEmpty()).to.eql(true);
    });

    it("turns an empty system into an empty map", function() {
        var map = this.parser.systemToMap("", createEntitySystem());
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
        var system = this.parser.mapToSystem(basicMap);
        var map = this.parser.systemToMap("aBasicMap",system);
        map.entities.sort();
        expect(map).to.eql(basicMap);
    });

    it("if an entity is in a system, but not the entities array, it will create the entity", function () {
        var sa = {
            components : {
                ea : {
                    foo : "barea"
                }
            }
        };
        var map = immutableAssign(emptyMap, {systems : { sa}});
        var system = this.parser.mapToSystem(map);
        expect(system.get("ea")).to.eql(entityA);
    });
});
