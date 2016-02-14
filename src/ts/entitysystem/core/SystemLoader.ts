import ContextKey from '../../framework/context/ContextKey';
import Project from '../../framework/project/Project';
import {ObservableMap} from '../../framework/observe/ObservableMap';
import {JsonLoader,SaveResult} from '../../util/JsonLoader';
import {EntitySystem} from './core/EntitySystem';
import {serialize, deserialize} from '../util/serialize/Serializer';
import * as map from './Map';
import Component from './Component';
import {Entity} from './Entity';
import ComponentFactory from './ComponentFactory';

/**
 * Class used to load entity systems from maps and save entity systems to maps.
 */
@ContextKey('entityframework.SystemLoader')
export default class SystemLoader {
    private _project : Project;
    private _jsonLoader : JsonLoader;

    /**
     * Initialize a system loader for a specific project.
     * @param project Project the loader is loading for.
     * @param jsonLoader JsonLoader that should be used to save and load paths.
     */
    constructor(project : Project, jsonLoader : JsonLoader) {
        this._project = project;
        this._jsonLoader = jsonLoader;
    }

    /**
     * Load an EntitySystem from the map.
     * @param mapName Name of the map to load the EntitySystem from.
     * @param emptySystem An empty entity system with the correct component types. The system will be
     *           used to store the results of the loading process.
     * @returns A promise that resolves to the EntitySystem.
     */
    loadMap(mapName : string, emptySystem : EntitySystem) : Promise<EntitySystem> {
        return this._jsonLoader.getJsonFromPath(this._project.getMapPath(mapName))
            .then((mapJson : string) => {
                if (!mapJson) {
                    return emptySystem;
                }

                var emptyMap = this.getEmptyMap(emptySystem);
                var loadedMap : map.GameMap = <any>deserialize(mapJson, emptyMap);

                this.initEntitySystem(loadedMap,emptySystem);

                return emptySystem;
            });
    }


    /**
     * Save the EntitySystem to the map.
     * @param mapName Name of the map to save to.
     * @param system EntitySystem to save.
     * @returns A promise that can be used to handle a successful save or an error.
     */
    saveMap(mapName : string, system : EntitySystem) : Promise<SaveResult> {
        var saveMap : map.GameMap = new map.Map();

        saveMap.key = mapName;

        system.forEachType(function (factory : ComponentFactory, key : string) {
            saveMap.systems[key] = {components : new ObservableMap()};
        });

        system.forEach((entity : Entity, entityKey : string) => {
            saveMap.entities.push(entityKey);
            entity.forEach((component : Component, componentKey : string) => {
                saveMap.systems[componentKey].components.put(entityKey, component);
            });
        });

        saveMap.assets = system.collectAssets();

        var mapString = serialize(saveMap);
        var mapPath = this._project.getMapPath(mapName);

        return this._jsonLoader.saveJsonToPath(mapPath, mapString);
    }

    private getEmptyMap(emptySystem : EntitySystem) {
        var emptyMap = new  map.Map();
        emptySystem.forEachType(function(factory : ComponentFactory) {
            var map;
            if (factory.isPolymorphic) {
                map = new ObservableMap();
            } else {
                map = new ObservableMap(() => factory.createComponent());
            }
            emptyMap.systems[factory.name] = {
                components : map
            };
        });
        return emptyMap;
    }

    private initEntitySystem(loadedMap : map.GameMap, emptySystem : EntitySystem) {
        var nextID = 0;
        loadedMap.entities.forEach((entityName : string) => {
            emptySystem.addEntity(entityName, new Entity());

            if (Number(entityName) > nextID) {
                nextID = Number(entityName) + 1;
            }
        });

        for(var systemName in loadedMap.systems) {
            var components = loadedMap.systems[systemName].components;
            components.forEach((entity,name) => {
                emptySystem.getEntity(name).addComponent(systemName, components.get(name));
            });
        }

        emptySystem.seedNextKey(nextID);
    }

}
