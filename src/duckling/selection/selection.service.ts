import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {Action, StoreService} from '../state';
import {EntityKey, EntitySystemService, Entity} from '../entitysystem';

/**
 * Interface describing the currently selected entity. Will be an empty object
 * if there is no selection.
 */
export interface Selection {
    selectedEntity? : EntityKey,
    entity? : Entity
}

/**
 * Service used for managing the selection in the application.
 */
@Injectable()
export class SelectionService {

    public selection : BehaviorSubject<Selection>;

    constructor(private _store : StoreService,
                private _entitySystem : EntitySystemService) {
        this.selection = new BehaviorSubject({});
        this._store.state.subscribe(state => {
            this.selection.next(this._getSelection(state.selection.selectedEntity))
        });
    }

    /**
     * Select the entity.
     * @param  entityKey The key of the entity to select.
     * @param  mergeKey  Optional mergeKey, describes which commands the action should be merged with.
     */
    select(entityKey : EntityKey, mergeKey? : any) {
        this._store.dispatch(selectionAction(entityKey), mergeKey);
    }

    /**
     * Clear the current selection.
     * @param  mergeKey  Optional mergeKey, describes which commands the action should be merged with.
     */
    deselect(mergeKey? : any) {
        this.select("", mergeKey);
    }

    private _getSelection(selectedEntity : EntityKey) : Selection {
        if (selectedEntity) {
            return {
                selectedEntity,
                entity : this._entitySystem.getEntity(selectedEntity) || null
            }
        } else {
            return {};
        }
    }
}

/**
 * State of the currently selected entity.
 */
export interface SelectionState {
    selectedEntity? : EntityKey;
}

/**
 * Reducer for the SelectionState.
 */
export function selectionReducer(state : SelectionState = {}, action : SelectionAction) {
    if (action.type === ACTION_SELECT_ENTITY) {
        return {
            selectedEntity : action.selectedEntity
        }
    }
    return state;
}

const ACTION_SELECT_ENTITY = "Selection.SelectEntity";
interface SelectionAction extends Action {
    selectedEntity? : EntityKey;
}
function selectionAction(selectedEntity : EntityKey) : SelectionAction {
    return {
        selectedEntity,
        type : ACTION_SELECT_ENTITY
    }
}
