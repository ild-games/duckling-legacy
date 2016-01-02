///<reference path="Map.ts"/>
module entityframework {

    import ObservableMap = framework.observe.ObservableMap;

    /**
     * Class used to load entity systems from maps and save entity systems to maps.
     */
    export class SystemLoader {
        private _project : framework.Project;
        private _jsonLoader : util.JsonLoader;

        /**
         * Initialize a system loader for a specific project.
         * @param project Project the loader is loading for.
         * @param jsonLoader JsonLoader that should be used to save and load paths.
         */
        constructor(project : framework.Project, jsonLoader : util.JsonLoader) {
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
                    var loadedMap : map.GameMap = <any>util.serialize.deserialize(mapJson, emptyMap);

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
        saveMap(mapName : string, system : EntitySystem) : Promise<util.SaveResult> {
            var saveMap : map.GameMap = new map.Map();

            saveMap.key = mapName;

            system.forEachType(function (factory : ComponentFactory, key : string) {
                saveMap.systems[key] = {components : new ObservableMap()};
            });

            system.forEach(function (entity : Entity, entityKey : string) {
                saveMap.entities.push(entityKey);
                entity.forEach(function (component : Component, componentKey : string) {
                    saveMap.systems[componentKey].components.put(entityKey, component);
                    component.collectAssets().forEach(function (asset : map.Asset) {
                        var exists = false;
                        saveMap.assets.forEach(function (existingAsset : map.Asset) {
                            if (existingAsset.key === asset.key && existingAsset.type === asset.type) {
                                exists = true;
                            }
                        });
                        if (!exists) {
                            saveMap.assets.push(asset);
                        }
                    });
                });
            });


            var mapString = util.serialize.serialize(saveMap);
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
            emptySystem.assets = loadedMap.assets;

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

}
