import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {createEntitySystem, EntitySystemService, EntityKey, EntitySystem} from '../entitysystem';
import {AttributeKey} from '../entitysystem/entity'
import {StoreService, clearUndoHistoryAction} from '../state';
import {PathService} from '../util';
import {JsonLoaderService, SaveResult} from '../util/json-loader.service';
import {immutableAssign} from '../util/model';
import {DialogService} from '../util/dialog.service';
import {glob} from '../util/glob';
import {JsonSchema} from '../util/json-schema';
import {Vector} from '../math/vector';
import {MigrationService, ProjectVersionInfo} from '../migration/migration.service';
import {compareVersions, EDITOR_VERSION} from '../util/version';

import {MapParserService, ParsedMap, createRawMap} from './map-parser.service';
import {
    switchProjectAction,
    doneLoadingProjectAction,
    openMapAction,
    changeCurrentMapDimensionAction,
    changeCurrentMapGridAction,
    changeCustomAttributes,
    Project,
    setVersionInfo
} from './project';
import {SnackBarService} from './snackbar.service';
import {CustomAttribute} from './custom-attribute';

const MAP_DIR = "maps";
const DEFAULT_INITIAL_MAP = "map1";
const USER_META_DATA_FILE = "user-preferences";

export type UserMetaData = {
    initialMap?: string
}

/**
 * The project service provides access to project level state and operations.
 */
@Injectable()
export class ProjectService {
    project : BehaviorSubject<Project>;

    constructor(private _entitySystem : EntitySystemService,
                private _storeService : StoreService,
                private _migrationService : MigrationService,
                private _jsonLoader : JsonLoaderService,
                private _pathService : PathService,
                private _mapParser : MapParserService,
                private _dialog : DialogService,
                private _snackbar : SnackBarService) {
        this.project = new BehaviorSubject(this._project);
        this._storeService.state.subscribe((state) => {
            this.project.next(state.project);
        });
    }

    /**
     * Open the project found at the given path.
     */
    async open(projectPath : string) {
        projectPath = this._pathService.normalize(projectPath);
        this._storeService.dispatch(switchProjectAction(projectPath));
        try {
            let versionInfo = await this._migrationService.openProject(projectPath);
            this._storeService.dispatch(setVersionInfo(versionInfo));
            await this._loadProjectMetaData();

            // if, in the future, user meta data needs to be accessed after the initial project
            // open, it should be a member on the project and put in the rxjs store.
            let userMetaData = await this._loadUserMetaData();
            await this.openMap(userMetaData.initialMap);
        } catch (error) {
            this._dialog.showErrorDialog("Unable to Open the Project", error.message);
        }
    }

    private async _loadProjectMetaData() {
        await this._loadCustomAttributes();
    }

    private async _loadCustomAttributes() {
        let attributes = await glob(`${this._customAttributesRoot}/*.json`);
        let attributePromises : Promise<void>[] = [];
        for (let customAttribute of attributes) {
            attributePromises.push(this._jsonLoader.getJsonFromPath(customAttribute).then(json => {
                this.addCustomAttribute(this._customAttributeFileToName(customAttribute), JSON.parse(json))
            }));
        }
        return Promise.all(attributePromises);
    }

    /**
     * Open the map described by the key.
     * @param mapKey Key of the map to open.
     */
    async openMap(mapKey : string) {
        let json = await this._jsonLoader.getJsonFromPath(this.getMapPath(mapKey));
        try {
            await this._parseMapJson(json, mapKey);
            this._snackbar.invokeSnacks();
        } catch (error) {
            this._dialog.showErrorDialog("Unable to Open the Map", error.message);
        }
    }

    /**
     * Save the projects current state.
     */
    async save() {
        let map = await this._mapParser.parsedMapToRawMap({
                key: this._project.currentMap.key,
                version: this._project.currentMap.key,
                entitySystem: this._entitySystem.entitySystem.value,
                dimension: this._project.currentMap.dimension,
                gridSize: this._project.currentMap.gridSize
            }, this._project.versionInfo);
        let json = JSON.stringify(map, null, 4);
        await this._saveProjectMetaData();
        await this._saveUserMetaData(this._buildUserMetaData());
        await this._jsonLoader.saveJsonToPath(this.getMapPath(this._project.currentMap.key), json);
        this._snackbar.invokeSnacks();
    }

    private async _saveProjectMetaData() {
        await this._saveCustomAttributes();
    }

    private async _saveCustomAttributes() {
        if (!this._project.customAttributes) {
            return;
        }

        for (let customAttribute of this._project.customAttributes) {
            await this._jsonLoader.saveJsonToPath(
                this._pathService.join(this._customAttributesRoot, customAttribute.key + '.json'),
                JSON.stringify(customAttribute.content, null, 4));
        }
    }

    private async _saveUserMetaData(userMetaData : UserMetaData) : Promise<void> {
        let json = JSON.stringify(userMetaData, null, 4);
        let saveResult = await this._jsonLoader.saveJsonToPath(this.getUserMetaDataPath(USER_META_DATA_FILE), json);
        if (!saveResult.isSuccess) {
            this._snackbar.addSnack("Error: There was a problem saving last opened map!");
        }
    }

    private async _loadUserMetaData() : Promise<UserMetaData> {
        let fileExists = await this._pathService.pathExists(this.getUserMetaDataPath(USER_META_DATA_FILE));
        let userPreferences : UserMetaData = {};
        if (fileExists) {
            let json = await this._jsonLoader.getJsonFromPath(this.getUserMetaDataPath(USER_META_DATA_FILE));
            userPreferences = JSON.parse(json);
        }

        return this._fillMissingUserPreferences(userPreferences);
    }

    private async _fillMissingUserPreferences(metaData : UserMetaData) : Promise<UserMetaData> {
        metaData["initialMap"] = metaData["initialMap"] || await this._initialUserPreferenceMap();
        return metaData;
    }

    private async _initialUserPreferenceMap() : Promise<string> {
        let initialMap = DEFAULT_INITIAL_MAP;
        let mapNames = await this.getMaps();
        if (mapNames.length > 0) {
            initialMap = mapNames[0];
        }
        return initialMap;
    }

    /**
     * Adds a new custom attribute to the project
     * @param key The key of the custom attribute
     * @param content The json that describes the attribute
     */
    addCustomAttribute(key : string, content : JsonSchema) {
        let currentAttributes = this._project.customAttributes;
        let newAttribute = {key, content };
        let newAttributes = currentAttributes ? currentAttributes.concat([newAttribute]) : [].concat([newAttribute]);
        this._storeService.dispatch(changeCustomAttributes(newAttributes));
    }

    isCustomAttribute(attributeKey : AttributeKey) : boolean {
        for (let customAttribute of this._project.customAttributes) {
            if (customAttribute.key === attributeKey) {
                return true;
            }
        }
        return false;
    }

    getCustomAttribute(attributeKey : AttributeKey) : CustomAttribute {
        for (let customAttribute of this._project.customAttributes) {
            if (customAttribute.key === attributeKey) {
                return customAttribute;
            }
        }
        return null;
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
        let mapsRoot = this._mapRoot;
        let mapsPromise = glob(`${mapsRoot}/**/*.map`);
        return mapsPromise.then(maps => maps.map(map => this._mapPathToRoot(mapsRoot, map)));
    }

    /**
     * Get the path to a specific meta data file for the project.
     * @param metaDataFile The name of the meta data file stored in the project/ folder (excluding file type)
     * @return the path that can be used to load the meta data file
     */
    getProjectMetaDataPath(metaDataFile : string) : string {
        return this._pathService.join(this.projectMetaDataDir, metaDataFile + ".json");
    }

    /**
     * Get the path to a specific meta data file for the user.
     * @param metaDataFile The name of the meta data file stored in the .duckling/ folder (excluding file type)
     * @return the path that can be used to load the meta data file
     */
    getUserMetaDataPath(metaDataFile : string) : string {
        return this._pathService.join(this.userMetaDataDir, metaDataFile + ".json");
    }

    private async _parseMapJson(json : any, key : string) {
        let rawMap = json ? JSON.parse(json) : createRawMap(this._project.versionInfo.mapVersion);
        rawMap = await this._migrationService.migrateMap(rawMap, this._project.versionInfo, this.projectMetaDataDir);

        let parsedMap = await this._mapParser.rawMapToParsedMap(rawMap);

        this._entitySystem.replaceSystem(parsedMap.entitySystem);
        if (!parsedMap.dimension) {
            parsedMap = immutableAssign(parsedMap, createRawMap(this._project.versionInfo.mapVersion));
        }
        if (!parsedMap.gridSize) {
            parsedMap = immutableAssign(parsedMap, createRawMap(this._project.versionInfo.mapVersion));
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

    private _buildUserMetaData() : UserMetaData {
        return {
            initialMap: this._project.currentMap.key
        };
    }

    private _mapPathToRoot(root : string, path : string) {
        return path.slice(root.length+1, -(".map".length));
    }

    private _customAttributeFileToName(customAttributePath : string) : string {
        return customAttributePath.slice(this._customAttributesRoot.length+1, -(".json".length));
    }

    private get _mapRoot() {
        return this._pathService.join(this._project.home, 'maps');
    }

    private get _customAttributesRoot() {
        return this._pathService.join(this._project.home, 'project', 'custom-attributes');
    }

    private get _project() : Project {
        return this._storeService.getState().project;
    }

    get home() {
        return this._project.home;
    }

    /**
     * the directory project metadata is stored in.
     */
    get projectMetaDataDir() : string {
        return this._pathService.join(this.home, "project");
    }

    /**
     * the directory user metadata is stored in.
     */
    get userMetaDataDir() : string {
        return this._pathService.join(this.home, ".duckling");
    }
}
