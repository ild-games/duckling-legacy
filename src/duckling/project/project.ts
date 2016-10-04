import {Action} from '../state';
import {immutableAssign} from '../util';

/**
 * State that describes the currently selected project.
 */
export interface Project {
    home? : string,
    loaded? : boolean
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
function _switchProject(action : SwitchProjectAction) : Project {
    return {
        home : action.home,
        loaded: false
    }
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
            return _switchProject(action as SwitchProjectAction);
        case ACTION_DONE_LOADING:
            return immutableAssign(state, {loaded: true});
    }

    return state;
}
