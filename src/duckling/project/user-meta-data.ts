import {Action} from '../state';
import {immutableAssign} from '../util';

export interface UserMetaData {
    initialMap?: string,
    mapMetaData?: {[mapName : string] : MapMetaData}
}

export interface MapMetaData {
    scrollTop?: number;
    scrollLeft?: number;
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

//////////////
// Initial Map
export function setInitialMapAction(newInitialMap : string) {
    return {
        type: ACTION_SET_INITIAL_MAP,
        newInitialMap
    }
}
export const ACTION_SET_INITIAL_MAP = "UserMetaData.SetInitialMap";
interface SetInitialMapAction extends Action {
    newInitialMap: string
}
function _setInitialMap(userMetaData : UserMetaData, action : SetInitialMapAction) : UserMetaData {
    return immutableAssign(
        userMetaData, 
        {
            ...userMetaData,
            initialMap: action.newInitialMap
        });
}


export function userMetaDataReducer(state : UserMetaData = {}, action : Action) {
    switch (action.type) {
        case ACTION_UPDATE_USER_META_DATA:
            return _updateUserMetaData(state, action as UpdateUserMetaDataAction);
        case ACTION_SET_INITIAL_MAP:
            return _setInitialMap(state, action as SetInitialMapAction);
        default:
            return state;
    }
}