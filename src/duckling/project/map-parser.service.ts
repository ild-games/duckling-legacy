import {Injectable} from '@angular/core';

import {createEntitySystem, Entity, EntitySystem, EntityKey} from '../entitysystem';
import {compareVersions, incompatibleReason, MAP_VERSION, VersionCompatibility} from '../version';
import {Vector} from '../math/vector';

import {Asset, AssetService} from './asset.service'
import {RequiredAssetService} from './required-asset.service'
import {ProjectLifecycleService} from './project-lifecycle.service';

/**
 * Interface describing the structure of an attribute in the map file.
 */
export type RawAttribute = any;

/**
 * Interface describing the structure of a system in a map file.
 */
export interface RawSystem {
    components : {[entityName : string] : RawAttribute};
}

/**
 * Interface describing the structure of a map file.
 */
export interface RawMapFile {
    key : string,
    entities : string [],
    assets: Asset[],
    systems : {[systemName : string] : RawSystem},
    version: string,
    dimension: Vector,
    gridSize: number
}
export let STARTER_RAW_MAP : RawMapFile = {
    key: "",
    version: MAP_VERSION,
    systems: {},
    assets: [],
    entities: [],
    dimension: {x: 1200, y: 800},
    gridSize: 16,
};


/**
 * Interface describing the structure of a parsed in map file.
 */
export interface ParsedMap {
    key: string,
    version: string,
    entitySystem: EntitySystem,
    dimension: Vector,
    gridSize: number,
}


@Injectable()
export class MapParserService {
    constructor(private _assets : AssetService,
                private _requiredAssets : RequiredAssetService,
                private _projectLifecycle : ProjectLifecycleService) {
    }

    /**
     * Take an object deserialized from a map and transform it into a ParsedMap with an entity system.
     * @param  map Object deserialized from a map file.
     * @return A ParsedMap with the entities and other information about the map
     */
    async rawMapToParsedMap(map : RawMapFile) : Promise<ParsedMap> {
        map = await this._projectLifecycle.executePostLoadMapHooks(map);
        let compatibility = compareVersions(map.version);
        if (compatibility !== VersionCompatibility.Compatible) {
            throw new Error(incompatibleReason(compatibility));
        }

        let entities : {[entityKey : string] : Entity} = {};

        for (let entityKey of map.entities) {
            entities[entityKey] = {};
        }

        for (let systemKey in map.systems) {
            let system = map.systems[systemKey];
            for (let entityKey in system.components) {
                if (!entities[entityKey]) {
                    entities[entityKey] = {};
                }
                entities[entityKey][systemKey] = system.components[entityKey];
            }
        }

        for (let asset of map.assets) {
            this._assets.add(asset);
        }

        let entitySystem = createEntitySystem().withMutations(system => {
            for (let key in entities) {
                system.set(key, entities[key])
            }
        });

        return Promise.resolve({
            key: map.key,
            version: map.version,
            entitySystem: entitySystem,
            dimension: map.dimension,
            gridSize: map.gridSize
        });
    }

    /**
     * Convert a parsed map with an entity system to a map file.
     * @param  parsedMap The parsed map
     * @return An object that can be serialized into a map.
     */
    async parsedMapToRawMap(parsedMap : ParsedMap) : Promise<RawMapFile> {
        let systems : {[systemKey : string] : RawSystem} = {};
        let entities : EntityKey[] = [];

        parsedMap.entitySystem.forEach((entity : Entity, entityKey : EntityKey) => {
            entities.push(entityKey);
            for (let systemKey in entity) {
                if (!systems[systemKey]) {
                    systems[systemKey] = {components: {}};
                }
                systems[systemKey].components[entityKey] = entity[systemKey];
            }
        });

        let assetList : Asset[] = [];
        let assetMap = this._requiredAssets.assetsForEntitySystem(parsedMap.entitySystem);
        for (let assetKey in assetMap) {
            assetList.push(assetMap[assetKey]);
        }

        let rawMap = {
            key : parsedMap.key,
            systems : systems,
            entities : entities,
            assets : assetList,
            dimension : parsedMap.dimension,
            gridSize : parsedMap.gridSize,
            version: MAP_VERSION
        }
        return await this._projectLifecycle.executePreSaveMapHooks(rawMap);
    }
}
