import {Injectable} from 'angular2/core';
import {createStore, Store, Reducer} from 'redux';
import {BehaviorSubject} from 'rxjs';

import {EntitySystem} from '../entitysystem';
import {Action} from './actions';
import {
    createUndoRedoReducer,
    getCurrentState,
    AutoMerger,
    undoAction,
    redoAction,
    UndoRedoState
} from './undo-redo';

/**
 * Describes the overall structure of duckling's state.
 */
export interface DucklingState {
    entitySystem? : EntitySystem;
}

/**
 * Provides access to the redux store used to maintain the applications state.
 */
@Injectable()
export class StoreService {
    private _store : Store<UndoRedoState<DucklingState>>;

    /**
     * Observable that publishes updates to DucklingState.
     */
    state : BehaviorSubject<DucklingState> = new BehaviorSubject({});

    /**
     * Dispatch an action to the store.
     */
    dispatch(action : Action, mergeKey? : any) {
        if (mergeKey) {
            action.mergeKey = mergeKey;
        }
        this._store.dispatch(action);
    }

    /**
     * Gets the current state.
     * @return The current state of duckling's store.
     */
    getState() {
        return getCurrentState(this._store);
    }

    /**
     * Undo the last action.  Does nothing if there are no actions to undo.
     */
    undo() {
        this.dispatch(undoAction());
    }

    /**
     * Redo the last undone action. Does nothing if the last action was not an undo.
     */
    redo() {
        this.dispatch(redoAction());
    }

    /**
     * Set the reducer that will be used by duckling. Should only be called at app startup.
     * @param  reducer    Reducer that is used to manage duckling's state.
     * @param  autoMerger Function that is used to determine when two actions should be merged.
     */
    setReducer(reducer : Reducer<DucklingState>, autoMerger : AutoMerger) {
        this._store = createStore(createUndoRedoReducer(reducer, autoMerger));
        this._store.subscribe(() => {
            this.state.next(this.getState());
        });
    }
}
