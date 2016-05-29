import {projectReducer} from './project';
import {entitySystemReducer} from './entitysystem';
import {selectionReducer, copyPasteReducer} from './selection';
import {Action} from './state';

/**
 * Main reducer for a duckling application. It is a composition of all the reducers
 * in the application.
 */
export function mainReducer(state : any = {}, action : Action) {
    return {
        entitySystem : entitySystemReducer(state.entitySystem, action),
        project : projectReducer(state.project, action),
        selection : selectionReducer(state.selection, action),
        clipboard : copyPasteReducer(state.clipboard, action)
    };
}
