import {Injectable} from '@angular/core';

import {createEntitySystem, EntitySystemService, EntityKey, EntitySystem} from '../entitysystem';
import {StoreService, clearUndoHistoryAction} from '../state';
import {JsonLoaderService, PathService} from '../util';
import {MapParserService} from './map-parser.service';
import {switchProjectAction, doneLoadingProjectAction, Project} from './project';

const MAP_DIR = "maps";
const MAP_NAME = "map1"; //Note - Eventually this will be a dynamic property

/**
 * The project service provides access to project level state and operations.
 */
@Injectable()
export class ProjectService {
    constructor(private _entitySystem : EntitySystemService,
                private _store : StoreService,
                private _jsonLoader : JsonLoaderService,
                private _pathService : PathService,
                private _mapParser : MapParserService) {

    }

    /**
     * Open the project found at the given path.
     */
    open(projectPath : string) {
        this._store.dispatch(switchProjectAction(projectPath));

        this._jsonLoader.getJsonFromPath(this.getMapPath(MAP_NAME))
        .then((json : any) => {
            var system : EntitySystem;
            if (json) {
                system = this._mapParser.mapToSystem(JSON.parse(json));
            } else {
                system = createEntitySystem();
            }

            this._entitySystem.replaceSystem(system);

            this._store.dispatch(doneLoadingProjectAction());
            this._store.dispatch(clearUndoHistoryAction());
        });
    }

    /**
     * Save the projects current state.
     */
    save() {
        var map = this._mapParser.systemToMap(MAP_NAME, this._entitySystem.entitySystem.value);
        var json = JSON.stringify(map, null, 4);
        this._jsonLoader.saveJsonToPath(this.getMapPath(MAP_NAME), json);
    }

    /**
     * Reload the current project.
     */
    reload() {
        this.open(this.project.home);
    }

    /**
     * Get the path to a specific map file.
     * @param  mapName The name of the map the path should be retrieved for.
     * @return The Path that can be used to load the map.
     */
    getMapPath(mapName : string) : string {
        return this._pathService.join(this.project.home, "maps", mapName + ".map");
    }

    get project() : Project {
        return this._store.getState().project;
    }
}
