import {Injectable} from 'angular2/core';
import {createStore, Store, Reducer} from 'redux';
import {BehaviorSubject} from 'rxjs';

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
 * Provides access to the redux store used to maintain the applications state.
 */
@Injectable()
export class StoreService {
    private _store : Store<UndoRedoState<any>>;

    /**
     * Observable that publishes updates to DucklingState.
     */
    state : BehaviorSubject<any>;

    /**
     * Initialize the store service. Should be constructed then injected into duckling.
     * @param  reducer    Reducer that is used to manage duckling's state.
     * @param  autoMerger Function that is used to determine when two actions should be merged.
     */
    constructor(reducer : Reducer<any>, autoMerger : AutoMerger) {
        this._store = createStore(createUndoRedoReducer(reducer, autoMerger));
        this.state = new BehaviorSubject(this.getState());
        this._store.subscribe(() => {
            this.state.next(this.getState());
        });
    }

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
}
