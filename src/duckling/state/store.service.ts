import { Inject, Injectable } from '@angular/core';
import { createStore, Store, Reducer } from 'redux';
import { BehaviorSubject } from 'rxjs';

import { Action } from './actions';
import {
  createUndoRedoReducer,
  getCurrentState,
  AutoMerger,
  undoAction,
  redoAction,
  UndoRedoState,
  getLastMergeKey,
} from './undo-redo';

type InjectableReducer = Reducer<any> & Injectable;

/**
 * Provides access to the redux store used to maintain the applications state.
 */
@Injectable()
export class StoreService {
  private _store: Store<UndoRedoState<any>>;

  /**
   * Observable that publishes updates to DucklingState.
   */
  state: BehaviorSubject<any>;

  /**
   * Initialize the store service. Should be constructed then injected into duckling.
   * @param  reducer    Reducer that is used to manage duckling's state.
   * @param  autoMerger Function that is used to determine when two actions should be merged.
   */
  constructor(
    @Inject('reducer') reducer: Reducer<any>,
    @Inject('autoMerger') autoMerger: AutoMerger
  ) {
    this._store = createStore(createUndoRedoReducer(reducer, autoMerger));
    this.state = new BehaviorSubject(this.getState());
    this._store.subscribe(() => {
      this.state.next(this.getState());
    });
    this._disableBrowserUndoRedo();
  }

  /**
   * Dispatch an action to the store.
   */
  dispatch(action: Action, mergeKey?: any) {
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

  getLastMergeKey() {
    return getLastMergeKey(this._store);
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

  private _disableBrowserUndoRedo() {
    document.onkeydown = (event) => {
      if (this._undoKeyCombination(event)) {
        event.preventDefault();
        this.undo();
      }

      if (this._redoKeyCombination(event)) {
        event.preventDefault();
        this.redo();
      }
    };
  }

  private _undoKeyCombination(event: KeyboardEvent): boolean {
    return (
      (event.ctrlKey || event.metaKey) &&
      String.fromCharCode(event.which).toLowerCase() === 'z'
    );
  }

  private _redoKeyCombination(event: KeyboardEvent): boolean {
    return (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      String.fromCharCode(event.which).toLowerCase() === 'z'
    );
  }
}
