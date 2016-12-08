import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {createEntitySystem, EntitySystemService, EntityKey, EntitySystem} from '../entitysystem';
import {StoreService, clearUndoHistoryAction} from '../state';
import {JsonLoaderService, PathService} from '../util';
import {immutableAssign} from '../util/model';
import {DialogService} from '../util/dialog.service';
import {glob} from '../util/glob';
import {Vector} from '../math/vector';

import {MapParserService, ParsedMap, STARTER_PARSED_MAP} from './map-parser.service';
import {
    switchProjectAction, 
    doneLoadingProjectAction, 
    openMapAction, 
    changeCurrentMapDimensionAction, 
    changeCurrentMapGridAction, 
    Project
} from './project';

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
                private _mapParser : MapParserService,
                private _dialog : DialogService) {
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
        this._jsonLoader.getJsonFromPath(this.getMapPath(mapKey))
        .then((json : any) => {
            try {
                this._parseMapJson(json, mapKey);
            } catch (error) {
                this._dialog.showErrorDialog("Error Parsing Map File", error.message);
            }
        });
    }

    /**
     * Save the projects current state.
     */
    save() {
        let map = this._mapParser.parsedMapToRawMap({
                key: this._project.currentMap.key,
                version: this._project.currentMap.key,
                entitySystem: this._entitySystem.entitySystem.value,
                dimension: this._project.currentMap.dimension,
                gridSize: this._project.currentMap.gridSize,
            });
        let json = JSON.stringify(map, null, 4);
        this._jsonLoader.saveJsonToPath(this.getMapPath(this._project.currentMap.key), json);
    }

    /**
     * Reload the current project.
     */
    reload() {
        this.openMap(this._project.currentMap.key);
    }

    /**
     * Change the dimension of the map
     * @param newDimension new dimensions of the map
     */
    changeDimension(newDimension : Vector) {
        this._storeService.dispatch(changeCurrentMapDimensionAction(newDimension));
    }
    
    /**
     * Change the grid size of the map
     * @param newGridSize new grid size of the map
     */
    changeGridSize(newGridSize : number) {
        this._storeService.dispatch(changeCurrentMapGridAction(newGridSize));
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

    private _parseMapJson(json : any, key : string) {
        let parsedMap : ParsedMap = immutableAssign(STARTER_PARSED_MAP, {});
        if (json) {
            parsedMap = this._mapParser.rawMapToParsedMap(JSON.parse(json));
        } else {
            parsedMap = immutableAssign(parsedMap, {entitySystem: createEntitySystem()});
        }

        this._entitySystem.replaceSystem(parsedMap.entitySystem);
        if (!parsedMap.dimension) {
            parsedMap = immutableAssign(parsedMap, {dimension: STARTER_PARSED_MAP.dimension});
        }
        if (!parsedMap.gridSize) {
            parsedMap = immutableAssign(parsedMap, {gridSize: STARTER_PARSED_MAP.gridSize});
        }

        this._storeService.dispatch(openMapAction({
            key: key,
            version: parsedMap.version,
            dimension: parsedMap.dimension,
            gridSize: parsedMap.gridSize 
        }));
        this._storeService.dispatch(doneLoadingProjectAction());
        this._storeService.dispatch(clearUndoHistoryAction());
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
