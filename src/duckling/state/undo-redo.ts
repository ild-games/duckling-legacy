import {Store, Reducer} from 'redux';

import {Action} from './actions';
import {List} from 'immutable';

export const UNDO_ACTION = "UndoRedo.Undo";
export const REDO_ACTION = "UndoRedo.Redo";

/**
 * Create a new undo action.
 */
export function undoAction() : Action {
    return {
        type : UNDO_ACTION
    }
}

/**
 * Create a new redo action.
 */
export function redoAction() : Action {
    return {
        type : REDO_ACTION
    }
}

/**
 * State used by the UndoRedo reducer.
 */
export interface UndoRedoState<T> {
    stateHistory : List<T>;
    undoHistory? : List<T>;
    lastAction? : Action;
    state? : T;
}

/**
 * Get the current state from the UndoRedoStore.
 */
export function getCurrentState<T>(undoRedoStore : Store<UndoRedoState<T>>) : T {
    var state = undoRedoStore.getState();
    return state ? state.state : null;
}

/**
 * A function that is used to determine if two actions should be merged.
 */
export interface AutoMerger {
    (action : Action, previousAction : Action) : boolean;
}

function initialState<T>(rootReducer : Reducer<T>) : UndoRedoState<T> {
    return {
        stateHistory : List<T>(),
        state : rootReducer(undefined, {type : ""})
    }
}

/**
 * Given a reducer and an automerger determine construct a reducer for duckling that supports
 * undo and redo.
 */
export function createUndoRedoReducer<T>(rootReducer : Reducer<T>, autoMerger : AutoMerger) : Reducer<UndoRedoState<T>> {
   return function(state : UndoRedoState<T>, action : Action) : UndoRedoState<T> {
       state = state || initialState(rootReducer);

       switch (action.type) {
           case UNDO_ACTION:
               return undo(state);
           case REDO_ACTION:
               return redo(state);
           default:
               return applyReducer<T>(rootReducer, autoMerger, state, action);
       }
   }
}

function applyReducer<T>(rootReducer : Reducer<T>,
                      autoMerger : AutoMerger,
                      state : UndoRedoState<T>,
                      action : Action) : UndoRedoState<T> {
    var baseState = state;
    if (shouldMerge(action, state.lastAction, autoMerger)) {
        baseState = undo(state);
    }

    return {
        stateHistory : baseState.stateHistory.push(baseState.state),
        state : rootReducer(baseState.state, action),
        lastAction : action
    }
}

function shouldMerge(action : Action, prevAction : Action, autoMerger : AutoMerger) {
    if (!action || !prevAction) {
        return false;
    }

    if (action.mergeKey || prevAction.mergeKey) {
        return action.mergeKey === prevAction.mergeKey;
    }

    return autoMerger(action, prevAction);
}

function undo<T>(state : UndoRedoState<T>) : UndoRedoState<T> {
    if (!state.stateHistory.isEmpty()) {
        var undoHistory : List<any> = state.undoHistory ? state.undoHistory : List();
        var nextState = state.stateHistory.last();
        return {
            stateHistory : state.stateHistory.pop(),
            undoHistory : undoHistory.push(state.state),
            state : nextState
        }
    } else {
        return state;
    }
}

function redo<T>(state : UndoRedoState<T>) : UndoRedoState<T> {
    if (state.undoHistory && !state.undoHistory.isEmpty()) {
        return {
            stateHistory : state.stateHistory.push(state.state),
            undoHistory : state.undoHistory.pop(),
            state : state.undoHistory.last()
        }
    } else {
        return state;
    }
}
