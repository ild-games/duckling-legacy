import {projectReducer} from './project';
import {entitySystemReducer} from './entitysystem';
import {selectionReducer, copyPasteReducer} from './selection';
import {Action} from './state';
import {optionsReducer} from './state/options.service';
import {layerReducer} from './entitysystem/services/entity-layer.service';
import {collisionTypesReducer} from './game/collision/collision-types.service';

/**
 * Main reducer for a duckling application. It is a composition of all the reducers
 * in the application.
 */
export function mainReducer(state : any = {}, action : Action) {
    return {
        entitySystem : entitySystemReducer(state.entitySystem, action),
        project : projectReducer(state.project, action),
        selections : selectionReducer(state.selections, action),
        clipboard : copyPasteReducer(state.clipboard, action),
        options : optionsReducer(state.options, action),
        layers : layerReducer(state.layers, action),
        collision: collisionTypesReducer(state.collision, action)
    };
}
