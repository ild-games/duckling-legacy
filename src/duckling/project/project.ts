import {Action} from '../state';
import {immutableAssign} from '../util';
import {Vector} from '../math/vector';
import {MapVersion} from '../util/version';
import {ProjectVersionInfo} from '../migration/migration.service';

interface ProjectMap {
    key: string,
    version: string,
    dimension: Vector,
    gridSize: number,
}

/**
 * State that describes the currently selected project.
 */
export interface Project {
    home? : string,
    loaded? : boolean,
    currentMap? : ProjectMap,
    versionInfo? : ProjectVersionInfo
}

/**
 * Create a function that can be used to switch what project is open.
 * @param  home The home path of the project.
 * @return An action that can be dispatched to switch the project.
 */
export function switchProjectAction(home : string) : SwitchProjectAction {
    return {
        type : ACTION_SWITCH_PROJECT,
        home
    }
}

const ACTION_SWITCH_PROJECT = "Project.Switch";
interface SwitchProjectAction extends Action {
    home : string,
}
function _switchProject(project : Project, action : SwitchProjectAction) : Project {
    return {loaded: false, home : action.home};
}

const ACTION_SET_VERSION = "Project.SetVersion";
interface SetVersionAction extends Action {
    type : "Project.SetVersion",
    version : ProjectVersionInfo
}
function _setMapVersion(project : Project, action : SetVersionAction) : Project {
    return {...project, versionInfo: action.version}
}
export function setVersionInfo(version : ProjectVersionInfo) {
    return {type : ACTION_SET_VERSION, version};
}

/**
 * Create an action that opens the map. Done Loading Project action should be
 * used once the load is finished.
 * @param  mapName The name of the current map.
 */
export function openMapAction(map : ProjectMap) {
    return {
        type: ACTION_OPEN_MAP,
        map: map
    }
}
export const ACTION_OPEN_MAP = "Project.OpenMap";
interface OpenMapAction extends Action {
    map: {
        key: string,
        version: string,
        dimension: Vector,
        gridSize: number
    }
}
function _openMap(project : Project, action : OpenMapAction) {
    return immutableAssign(project, {currentMap : action.map, loaded : false});
}

/**
 * Create an action that changes the dimension of the current map.
 * @param newDimension The new dimensions of the map
 */
export function changeCurrentMapDimensionAction(newDimension : Vector) {
    return {
        type: ACTION_CHANGE_MAP_DIMENSION,
        newDimension: newDimension
    }
}
export const ACTION_CHANGE_MAP_DIMENSION = "Project.ChangeCurrentMapDimension";
interface ChangeCurrentMapDimensionAction extends Action {
    newDimension: Vector
}
function _changeCurrentMapDimension(project : Project, action : ChangeCurrentMapDimensionAction) {
    let map = immutableAssign(project.currentMap, {dimension: action.newDimension});
    return immutableAssign(project, {currentMap : map});
}

/**
 * Create an action that changes the grid size of the current map.
 * @param newGridSize The new grid size of the map
 */
export function changeCurrentMapGridAction(newGridSize : number) {
    return {
        type: ACTION_CHANGE_MAP_GRID,
        newGridSize: newGridSize
    }
}
export const ACTION_CHANGE_MAP_GRID = "Project.ChangeCurrentMapGrid";
interface ChangeCurrentMapGridAction extends Action {
    newGridSize: number
}
function _changeCurrentMapGrid(project : Project, action : ChangeCurrentMapGridAction) {
    let map = immutableAssign(project.currentMap, {gridSize: action.newGridSize});
    return immutableAssign(project, {currentMap : map});
}

/**
 * Create an action that marks the project as done loading.
 */
export function doneLoadingProjectAction() {
    return {
        type : ACTION_DONE_LOADING
    }
}
const ACTION_DONE_LOADING = "Project.DoneLoading";

/**
 * Reducer used to update the state of the selected project.
 */
export function projectReducer(state : Project = {}, action : Action) {

    switch (action.type) {
        case ACTION_SWITCH_PROJECT:
            return _switchProject(state, action as SwitchProjectAction);
        case ACTION_DONE_LOADING:
            return immutableAssign(state, {loaded: true});
        case ACTION_OPEN_MAP:
            return _openMap(state, action as OpenMapAction);
        case ACTION_CHANGE_MAP_DIMENSION:
            return _changeCurrentMapDimension(state, action as ChangeCurrentMapDimensionAction);
        case ACTION_CHANGE_MAP_GRID:
            return _changeCurrentMapGrid(state, action as ChangeCurrentMapGridAction);
        case ACTION_SET_VERSION:
            return _setMapVersion(state, action as SetVersionAction);
    }

    return state;
}
