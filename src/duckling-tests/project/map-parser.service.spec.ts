import "mocha";
import * as chai from "chai";
import { expect } from "chai";
import spies from "chai-spies";
import "reflect-metadata";

chai.use(spies);

import {
    createEntitySystem,
    mergeEntityAction,
} from "../../duckling/entitysystem";
import {
    RawMapFile,
    ParsedMap,
    MapParserService,
    AssetService,
    RequiredAssetService,
} from "../../duckling/project";
import { ProjectLifecycleService } from "../../duckling/project/project-lifecycle.service";
import { StoreService } from "../../duckling/state";
import { mainReducer } from "../../duckling/main.reducer";
import { immutableAssign, PathService } from "../../duckling/util";

const MAP_VERSION = "1.0";
const PROJECT_VERSION_INFO = {
    projectVersion: MAP_VERSION,
};

let emptyMap: RawMapFile = {
    key: "",
    entities: [],
    assets: [],
    systems: {},
    version: "1.0",
    gridSize: 0,
};

let entityA = {
    sa: {
        foo: "barea",
    },
};

let entityB = {
    sa: {
        foo: "bareb",
    },
    sb: {
        isSpecial: true,
    },
};

let basicMap: RawMapFile = {
    key: "aBasicMap",
    entities: ["ea", "eb", "ec"],
    assets: [],
    systems: {
        sa: {
            components: {
                ea: {
                    foo: "barea",
                },
                eb: {
                    foo: "bareb",
                },
            },
        },
        sb: {
            components: {
                eb: {
                    isSpecial: true,
                },
            },
        },
    },
    version: MAP_VERSION,
    gridSize: 16,
};

let emptyParsedMap: ParsedMap = {
    entitySystem: createEntitySystem(),
    gridSize: 0,
    key: "",
    version: "",
};

describe("MapLoaderService.LifecycleHooks", function() {
    beforeEach(function() {
        this.storeService = new StoreService(mainReducer, mergeEntityAction);
        this.requiredAssetService = new RequiredAssetService();
        this.projectLifecycleService = new ProjectLifecycleService();
        this.parser = new MapParserService(
            new AssetService(
                this.storeService,
                new PathService(),
                this.requiredAssetService
            ),
            this.requiredAssetService,
            this.projectLifecycleService
        );
    });

    it("successfully executes a post-load hook", async function() {
        let postLoadSpy = chai.spy((map: RawMapFile) => Promise.resolve(map));
        this.projectLifecycleService.addPostLoadMapHook(postLoadSpy);
        await this.parser.rawMapToParsedMap(emptyMap);
        expect(postLoadSpy).to.have.been.called();
    });

    it("successfully executes a pre-save hook", async function() {
        let preSaveSpy = chai.spy((map: RawMapFile) => Promise.resolve(map));
        this.projectLifecycleService.addPreSaveMapHook(preSaveSpy);
        await this.parser.parsedMapToRawMap(
            emptyParsedMap,
            PROJECT_VERSION_INFO
        );
        expect(preSaveSpy).to.have.been.called();
    });
});

describe("MapLoaderService", function() {
    beforeEach(function() {
        let storeService = new StoreService(mainReducer, mergeEntityAction);
        let requiredAssetService = new RequiredAssetService();
        this.parser = new MapParserService(
            new AssetService(
                storeService,
                new PathService(),
                requiredAssetService
            ),
            requiredAssetService,
            new ProjectLifecycleService()
        );
    });

    it("turns an empty map into an empty system", async function() {
        let parsedMap = await this.parser.rawMapToParsedMap(
            Object.assign({}, emptyMap)
        );
        expect(parsedMap.entitySystem.isEmpty()).to.eql(true);
    });

    it("turns an empty system into an empty map", async function() {
        let map = await this.parser.parsedMapToRawMap(
            emptyParsedMap,
            PROJECT_VERSION_INFO
        );
        expect(map).to.eql(emptyMap);
    });

    describe("loading a map into an entity system", function() {
        beforeEach(async function() {
            this.parsedMap = await this.parser.rawMapToParsedMap(basicMap);
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

    it("loading and saving a map preserves the original map", async function() {
        let parsedMap = await this.parser.rawMapToParsedMap(basicMap);
        let map = await this.parser.parsedMapToRawMap(
            parsedMap,
            PROJECT_VERSION_INFO
        );
        map.entities.sort();
        expect(map).to.eql(basicMap);
    });

    it("if an entity is in a system, but not the entities array, it will create the entity", async function() {
        let sa = {
            components: {
                ea: {
                    foo: "barea",
                },
            },
        };
        let map = immutableAssign(emptyMap, { systems: { sa } });
        let parsedMap = await this.parser.rawMapToParsedMap(map);
        expect(parsedMap.entitySystem.get("ea")).to.eql(entityA);
    });
});
