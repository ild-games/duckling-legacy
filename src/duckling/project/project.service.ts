import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {createEntitySystem, EntitySystemService, EntityKey, EntitySystem} from '../entitysystem';
import {StoreService, clearUndoHistoryAction} from '../state';
import {JsonLoaderService, PathService} from '../util';
import {glob} from '../util/glob';
import {MapParserService} from './map-parser.service';
import {switchProjectAction, doneLoadingProjectAction, openMapAction, Project} from './project';

const MAP_DIR = "maps";
const MAP_NAME = "map1"; //Note - Eventually this will be a dynamic property

/**
 * The project service provides access to project level state and operations.
 */
@Injectable()
export class ProjectService {
    project : BehaviorSubject<Project>;

    constructor(private _entitySystem : EntitySystemService,
                private _storeService : StoreService,
                private _jsonLoader : JsonLoaderService,
                private _pathService : PathService,
                private _mapParser : MapParserService) {
        this.project = new BehaviorSubject(this._project);
        this._storeService.state.subscribe((state) => {
            this.project.next(state.project);
        });
    }

    /**
     * Open the project found at the given path.
     */
    open(projectPath : string) {
        this._storeService.dispatch(switchProjectAction(projectPath));
        this.openMap(MAP_NAME);
    }

    /**
     * Open the map described by the key.
     * @param mapKey Key of the map to open.
     */
    openMap(mapKey : string) {
        this._storeService.dispatch(openMapAction(mapKey));
        this._jsonLoader.getJsonFromPath(this.getMapPath(mapKey))
        .then((json : any) => {
            let system : EntitySystem;
            if (json) {
                system = this._mapParser.mapToSystem(JSON.parse(json));
            } else {
                system = createEntitySystem();
            }

            this._entitySystem.replaceSystem(system);

            this._storeService.dispatch(doneLoadingProjectAction());
            this._storeService.dispatch(clearUndoHistoryAction());
        });
    }

    /**
     * Save the projects current state.
     */
    save() {
        let map = this._mapParser.systemToMap(this._project.currentMap, this._entitySystem.entitySystem.value);
        let json = JSON.stringify(map, null, 4);
        this._jsonLoader.saveJsonToPath(this.getMapPath(this._project.currentMap), json);
    }

    /**
     * Reload the current project.
     */
    reload() {
        this.openMap(this._project.currentMap);
    }

    /**
     * Get the path to a specific map file.
     * @param  mapName The name of the map the path should be retrieved for.
     * @return The Path that can be used to load the map.
     */
    getMapPath(mapName : string) : string {
        return this._pathService.join(this._project.home, "maps", mapName + ".map");
    }

    /**
     * Get an array containing the available maps.
     * @return A promise for an array of map names.
     */
    getMaps() : Promise<string []> {
        let mapsRoot = `${this._project.home}/maps/`;
        let mapsPromise = glob(`${mapsRoot}/**/*.map`);
        return mapsPromise.then(maps => maps.map(map => this._mapPathToRoot(mapsRoot, map)));
    }

    /**
     * The project's root directory.
     */
    get home() {
        return this._project.home;
    }

    private _mapPathToRoot(root : string, path : string) {
        return path.slice(root.length, -(".map".length));
    }

    private get _mapRoot() {
        return `${this._project.home}/maps/`
    }

    private get _project() : Project {
        return this._storeService.getState().project;
    }
}
