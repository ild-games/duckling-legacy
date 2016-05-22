import {Action} from './actions';
import {List} from 'immutable';

export const UNDO_ACTION = "UndoRedo.Undo";
export const REDO_ACTION = "UndoRedo.Redo";

/**
 * Create a new undo action.
 */
export function undoAction() : Action {
    return {
        name : UNDO_ACTION
    }
}

/**
 * Create a new redo action.
 */
export function redoAction() : Action {
    return {
        name : REDO_ACTION
    }
}

/**
 * State used by the UndoRedo reducer.
 */
export interface UndoRedoState {
    stateHistory : List<any>;
    undoHistory? : List<any>;
    lastAction? : Action;
    state? : any;
}

/**
 * Intial state used by the undo reducer.
 * @type {UndoRedoState}
 */
const InitialState : UndoRedoState = {
    stateHistory : List<any>(),
}

/**
 * Get the current state from the UndoRedoState.
 */
export function getCurrentState(undoRedoState : UndoRedoState) {
    return undoRedoState ? undoRedoState.state : null;
}

/**
 * The reducer function containing the actual application logic.
 */
export interface RootReducer<T> {
    (state : T, action : Action) : T;
}

/**
 * A function that is used to determine if two actions should be merged.
 */
export interface AutoMerger {
    (action : Action, previousAction : Action) : boolean;
}

/**
 * Given a reducer and an automerger determine construct a reducer for duckling that supports
 * undo and redo.
 */
export function createUndoRedoReducer<T>(rootReducer : RootReducer<T>, autoMerger : AutoMerger) {
   return function(state : UndoRedoState = InitialState, action : Action) : UndoRedoState {
       switch (action.name) {
           case UNDO_ACTION:
               return undo(state);
           case REDO_ACTION:
               return redo(state);
           default:
               return applyReducer<T>(rootReducer, autoMerger, state, action);
       }
   }
}

function applyReducer<T>(rootReducer : RootReducer<T>,
                      autoMerger : AutoMerger,
                      state : UndoRedoState,
                      action : Action) : UndoRedoState {
    var shouldMerge = state.lastAction ? autoMerger(action, state.lastAction) : false;
    var baseState = shouldMerge ? undo(state) : state;
    return {
        stateHistory : baseState.state.push(baseState.state),
        state : rootReducer(baseState.state, action)
    }
}

function undo(state : UndoRedoState) : UndoRedoState {
    if (!state.stateHistory.isEmpty()) {
        var undoHistory : List<any> = state.undoHistory ? state.undoHistory : List();
        var nextState = state.stateHistory.last();
        return {
            stateHistory : state.stateHistory.pop(),
            undoHistory : undoHistory.push(nextState),
            state : nextState
        }
    } else {
        return state;
    }
}

function redo(state : UndoRedoState) : UndoRedoState {
    if (state.undoHistory && !state.undoHistory.isEmpty()) {
        return {
            stateHistory : state.stateHistory.push(state.state),
            undoHistory : state.stateHistory.pop(),
            state : state.undoHistory.last()
        }
    } else {
        return state;
    }
}
