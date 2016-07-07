import {Injectable} from '@angular/core';

import {createEntitySystem, Entity, EntitySystem, EntityKey} from '../entitysystem';

/**
 * Interface describing the structure of an attribute in the map file.
 */
export type RawAttribute = any;

/**
 * Interface describing the structure of a system in a map file.
 */
export interface RawSystem {
    components : {[entityName:string]:RawAttribute};
}

/**
 * Interface describing the structure of a map file.
 */
export interface RawMapFile {
    key : string,
    entities : string [],
    assets: any [],
    systems : {[systemName:string]: RawSystem}
}

@Injectable()
export class MapParserService {
    /**
     * Take an object deserialized from a map and transform it into an entity system.
     * @param  map Object deserialized from a map file.
     * @return An EntitySystem with the entities contained in the map.
     */
    mapToSystem(map : RawMapFile) : EntitySystem {
        var entities : {[entityKey:string]:Entity} = {};

        for (var entityKey of map.entities) {
            entities[entityKey] = {};
        }

        for (var systemKey in map.systems) {
            var system = map.systems[systemKey];
            for (var entityKey in system.components) {
                if (!entities[entityKey]) {
                    entities[entityKey] = {};
                }
                entities[entityKey][systemKey] = system.components[entityKey];
            }
        }

        return createEntitySystem().withMutations(system => {
            for (var key in entities) {
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
        var systems : {[systemKey:string]:RawSystem} = {};
        var entities : EntityKey[] = [];

        system.forEach((entity : Entity, entityKey : EntityKey) => {
            entities.push(entityKey);
            for (var systemKey in entity) {
                if (!systems[systemKey]) {
                    systems[systemKey] = {components: {}};
                }
                systems[systemKey].components[entityKey] = entity[systemKey];
            }
        });

        return {
            key : mapKey,
            systems : systems,
            entities : entities,
            assets : [],
        }
    }
}
