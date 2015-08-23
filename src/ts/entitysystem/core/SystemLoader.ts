///<reference path="Map.ts"/>
module entityframework {
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
                    var nextID = 0;

                    var loadedMap : map.GameMap = <any>util.serialize.deserialize(mapJson);

                    loadedMap.entities.forEach((entityName : string) => {
                        emptySystem.addEntity(entityName, new Entity());

                        if (Number(entityName) > nextID) {
                            nextID = Number(entityName) + 1;
                        }
                    });

                    for(var systemName in loadedMap.systems) {
                        var components = loadedMap.systems[systemName]["components"];
                        for(var entityName in components) {
                            emptySystem.getEntity(entityName).addComponent(systemName, components[entityName]);
                        }
                    }

                    emptySystem.seedNextKey(nextID);
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
            var saveMap:map.GameMap = new map.Map();

            system.forEachType(function (factory : ComponentFactory, key : string) {
                saveMap.systems[key] = {components : {}};
            });

            system.forEach(function (entity : Entity, entityKey : string) {
                saveMap.entities.push(entityKey);
                entity.forEach(function (component : Component, componentKey : string) {
                    saveMap.systems[componentKey].components[entityKey] = component;
                });
            });

            var mapString = util.serialize.serialize(saveMap);
            var mapPath = this._project.getMapPath(mapName);

            return this._jsonLoader.saveJsonToPath(mapPath, mapString);
        }

    }

}
