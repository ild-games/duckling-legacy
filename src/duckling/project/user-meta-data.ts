import {Action} from '../state';
import {immutableAssign} from '../util';

export interface UserMetaData {
    initialMap?: string,
    mapMetaData: {[mapName : string] : MapMetaData}
}

export interface MapMetaData {
    scrollTop?: number;
    scrollLeft?: number;
    scale?: number;
}

///////////////////
// Update Meta Data
export function updateUserMetaDataAction(newUserMetaData : UserMetaData) {
    return {
        type: ACTION_UPDATE_USER_META_DATA,
        newUserMetaData
    };
}
export const ACTION_UPDATE_USER_META_DATA = "UserMetaData.UpdateUserMetaData";
interface UpdateUserMetaDataAction extends Action {
    newUserMetaData: UserMetaData
}
function _updateUserMetaData(userMetaData : UserMetaData, action : UpdateUserMetaDataAction) : UserMetaData {
    return immutableAssign(userMetaData, action.newUserMetaData);
}

///////////////////
// Scroll Positions
export function setScrollPositionsAction(mapName : string, newScrollPosition : {scrollTop: number, scrollLeft: number}) : SetScrollPositionsAction {
    return {
        type: ACTION_SET_SCROLL_POSITIONS,
        mapName,
        scrollTop: newScrollPosition.scrollTop,
        scrollLeft: newScrollPosition.scrollLeft
    }
}
export const ACTION_SET_SCROLL_POSITIONS = "UserMetaData.SetScrollPositions";
interface SetScrollPositionsAction extends Action {
    mapName: string,
    scrollTop: number,
    scrollLeft : number
}
function _setScrollPositions(userMetaData : UserMetaData, action : SetScrollPositionsAction) : UserMetaData {
    let newMapMetaData = {...userMetaData.mapMetaData};
    newMapMetaData[action.mapName] = {
        ...userMetaData.mapMetaData[action.mapName],
        scrollLeft: action.scrollLeft,
        scrollTop: action.scrollTop,
    };
    return immutableAssign(
        userMetaData, 
        {
            ...userMetaData,
            mapMetaData: {
                ...userMetaData.mapMetaData,
                ...newMapMetaData
            }
        });
}

////////
// Scale
export function setScaleAction(mapName : string, newScale : number) : SetScaleAction {
    return {
        type: ACTION_SET_SCALE,
        mapName,
        scale: newScale
    }
}
export const ACTION_SET_SCALE = "UserMetaData.SetScaleAction";
interface SetScaleAction extends Action {
    mapName: string,
    scale : number
}
function _setScale(userMetaData : UserMetaData, action : SetScaleAction) : UserMetaData {
    let newMapMetaData = {...userMetaData.mapMetaData};
    newMapMetaData[action.mapName] = {
        ...userMetaData.mapMetaData[action.mapName],
        scale: action.scale,
    };
    return immutableAssign(
        userMetaData, 
        {
            ...userMetaData,
            mapMetaData: {
                ...userMetaData.mapMetaData,
                ...newMapMetaData
            }
        });
}

//////////////
// Initial Map
export function setInitialMap(newInitialMap : string) : SetInitialMapAction {
    return {
        type: ACTION_SET_INITIAL_MAP,
        newInitialMap
    }
}
export const ACTION_SET_INITIAL_MAP = "UserMetaData.SetInitialMap";
interface SetInitialMapAction extends Action {
    newInitialMap : string
}
function _setInitialMap(userMetaData : UserMetaData, action : SetInitialMapAction) : UserMetaData {
    return immutableAssign(userMetaData, {
        ...userMetaData,
        initialMap: action.newInitialMap
    });
}

//////////
// Reducer
export function userMetaDataReducer(state : UserMetaData = {mapMetaData: {}}, action : Action) {
    switch (action.type) {
        case ACTION_UPDATE_USER_META_DATA:
            return _updateUserMetaData(state, action as UpdateUserMetaDataAction);
        case ACTION_SET_SCROLL_POSITIONS:
            return _setScrollPositions(state, action as SetScrollPositionsAction);
        case ACTION_SET_SCALE:
            return _setScale(state, action as SetScaleAction);
        case ACTION_SET_INITIAL_MAP:
            return _setInitialMap(state, action as SetInitialMapAction);
        default:
            return state;
    }
}