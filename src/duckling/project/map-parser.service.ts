import {Injectable} from '@angular/core';

import {createEntitySystem, Entity, EntitySystem, EntityKey} from '../entitysystem';
import {MAP_VERSION, majorMapVersion, minorMapVersion} from '../version';

import {Asset, AssetService} from './asset.service'
import {RequiredAssetService} from './required-asset.service'

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
    version: string
}


@Injectable()
export class MapParserService {
    constructor(private _assets : AssetService,
                private _requiredAssets : RequiredAssetService) {
    }

    /**
     * Take an object deserialized from a map and transform it into an entity system.
     * @param  map Object deserialized from a map file.
     * @return An EntitySystem with the entities contained in the map.
     */
    mapToSystem(map : RawMapFile) : EntitySystem {
        if (map.version === null || map.version === undefined) {
            throw new Error(`Incompatible map version! Editor expects ${MAP_VERSION} but map has no version`);
        }
        if (majorMapVersion(map.version) !== majorMapVersion(MAP_VERSION)) {
            throw new Error(`Incompatible map version! Editor expects map major version ${majorMapVersion(MAP_VERSION)} but map major version is ${majorMapVersion(map.version)}`);
        }
        if (parseInt(minorMapVersion(map.version)) > parseInt(minorMapVersion(MAP_VERSION))) {
            throw new Error(`Incompatible map version! Editor expects map minor version ${minorMapVersion(MAP_VERSION)} but map minor version is greater: ${minorMapVersion(map.version)}`);
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

        return createEntitySystem().withMutations(system => {
            for (let key in entities) {
                system.set(key, entities[key])
            }
        });
    }

    /**
     * Convert an entity system into a map file.
     * @param  mapKey The key of the map file.
     * @param  system The entity system being stored in the map.
     * @return An object that can be serialized into a map.
     */
    systemToMap(mapKey : string, system : EntitySystem) : RawMapFile {
        let systems : {[systemKey : string] : RawSystem} = {};
        let entities : EntityKey[] = [];

        system.forEach((entity : Entity, entityKey : EntityKey) => {
            entities.push(entityKey);
            for (let systemKey in entity) {
                if (!systems[systemKey]) {
                    systems[systemKey] = {components: {}};
                }
                systems[systemKey].components[entityKey] = entity[systemKey];
            }
        });

        let assetList : Asset[] = [];
        let assetMap = this._requiredAssets.assetsForEntitySystem(system);
        for (let assetKey in assetMap) {
            assetList.push(assetMap[assetKey]);
        }

        return {
            key : mapKey,
            systems : systems,
            entities : entities,
            assets : assetList,
            version: MAP_VERSION
        }
    }
}
