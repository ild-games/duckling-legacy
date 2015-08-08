///<reference path="Map.ts"/>
module entityframework {
    /**
     * Class used to load entity systems from maps and save entity systems to maps.
     */
    export class SystemLoader {
        private _project:framework.Project;
        private _jsonLoader:util.JsonLoader;

        /**
         * Initialize a system loader for a specific project.
         * @param project Project the loader is loading for.
         * @param jsonLoader JsonLoader that should be used to save and load paths.
         */
        constructor(project:framework.Project, jsonLoader:util.JsonLoader) {
            this._project = project;
            this._jsonLoader = jsonLoader;
        }

        /**
         * Load an EntitySystem from the map.
         * @param mapName Name of the map to load the EntitySystem from.
         * @returns A promise that resolves to the EntitySystem.
         */
        loadMap(mapName:string):Promise<EntitySystem> {
            return null;
        }

        /**
         * Save the EntitySystem to the map.
         * @param mapName Name of the map to save to.
         * @param system EntitySystem to save.
         * @returns A promise that can be used to handle a successful save or an error.
         */
        saveMap(mapName:string, system:EntitySystem):Promise<util.SaveResult> {
            var saveMap:map.GameMap = new map.Map();

            system.forEachType(function (factory:ComponentFactory, key:string) {
                saveMap.systems[key] = {components: {}};
            });

            system.forEach(function (entity:Entity, entityKey:string) {
                saveMap.entities.push(entityKey);
                entity.forEach(function (component:Component, componentKey:string) {
                    saveMap.systems[componentKey].components[entityKey] = component;
                });
            });

            var mapString = JSON.stringify(saveMap, util.replacer, 4);
            var mapPath = this._project.getMapPath(mapName);

            return this._jsonLoader.saveJsonToPath(mapPath, mapString);
        }

    }

}
