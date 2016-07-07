import 'reflect-metadata';
import {createStore} from 'redux';

import {Action, undoAction, redoAction, createUndoRedoReducer, clearUndoHistoryAction, getCurrentState} from '../../duckling/state';
import {testAction, testReducer, TestAction} from './reducer-helper';

function getState(store : any) : any {
    return getCurrentState<any>(store);
}

describe("undo-redo", function () {
    beforeEach(function() {
        var reducer = createUndoRedoReducer(testReducer, () => false);
        this.store = createStore(reducer);
    });

    describe("getCurrentState", function () {
        it("returns the default state on a new store", function() {
            expect(getCurrentState<any>(this.store).isDefaultState).toBe(true);
        });

        it("returns the current state after it is updated", function() {
            this.store.dispatch(testAction({isNewState : true}));
            expect(getCurrentState<any>(this.store).isNewState).toBe(true);
        });
    });

    describe("undo", function() {
        it("does not wipe out the initial state", function() {
            this.store.dispatch(undoAction());
            expect(getState(this.store).isDefaultState).toBe(true);
        });

        it("can return the state to the intial state", function() {
            this.store.dispatch(testAction({isNewState : true}));
            this.store.dispatch(undoAction());
            expect(getState(this.store).isDefaultState).toBe(true);
        });

        it("can be called multiple times to return you to the a previous state", function() {
            this.store.dispatch(testAction({update : 1}));
            this.store.dispatch(testAction({update : 2}));
            this.store.dispatch(testAction({update : 3}));
            this.store.dispatch(testAction({update : 4}));

            this.store.dispatch(undoAction());
            this.store.dispatch(undoAction());

            expect(getState(this.store).update).toBe(2);
        });
    });

    describe("clear", function() {
        it("removes the undo stack", function() {
            this.store.dispatch(testAction({update : 1}));
            this.store.dispatch(testAction({update : 2}));

            this.store.dispatch(clearUndoHistoryAction());
            this.store.dispatch(undoAction());

            expect(getState(this.store).update).toBe(2);
        });

        it("removes the redo stack", function() {
            this.store.dispatch(testAction({update : 1}));
            this.store.dispatch(testAction({update : 2}));

            this.store.dispatch(undoAction());
            this.store.dispatch(clearUndoHistoryAction());
            this.store.dispatch(redoAction());

            expect(getState(this.store).update).toBe(1);
        });
    });


    describe("redo", function() {
        it("does nothing to the initial state", function() {
            this.store.dispatch(redoAction());
            expect(getState(this.store).isDefaultState).toBe(true);
        });

        it("does nothing if no actions were undone", function() {
            this.store.dispatch(testAction({update : 1}));
            this.store.dispatch(redoAction());
            expect(getState(this.store).update).toBe(1);
        });

        it("redoes a single undo", function() {
            this.store.dispatch(testAction({update : 1}));
            this.store.dispatch(undoAction());
            this.store.dispatch(redoAction());
            expect(getState(this.store).update).toBe(1);
        });

        it("can redo multiple undos", function() {
            this.store.dispatch(testAction({update : 1}));
            this.store.dispatch(testAction({update : 2}));
            this.store.dispatch(testAction({update : 3}));

            this.store.dispatch(undoAction());
            this.store.dispatch(undoAction());
            this.store.dispatch(undoAction());

            this.store.dispatch(redoAction());
            this.store.dispatch(redoAction());

            expect(getState(this.store).update).toBe(2);
        });
    });

    describe("mergeKey", function() {
        it("unique merge keys do not merge", function() {
            this.store.dispatch(testAction({update : 1}, 1));
            this.store.dispatch(testAction({update : 2}, 2));

            this.store.dispatch(undoAction());

            expect(getState(this.store).update).toBe(1);
        });

        it("identical merge keys do merge", function() {
            this.store.dispatch(testAction({update : 1}, 1));
            this.store.dispatch(testAction({update : 2}, 2));
            this.store.dispatch(testAction({update : 3}, 2));
            this.store.dispatch(testAction({update : 4}, 3));

            this.store.dispatch(undoAction());
            this.store.dispatch(undoAction());

            expect(getState(this.store).update).toBe(1);
        });

        it("merges redo operations", function() {
            this.store.dispatch(testAction({update : 1}, 1));
            this.store.dispatch(testAction({update : 2}, 2));
            this.store.dispatch(testAction({update : 3}, 2));
            this.store.dispatch(testAction({update : 4}, 3));

            this.store.dispatch(undoAction());
            this.store.dispatch(undoAction());

            this.store.dispatch(redoAction());

            expect(getState(this.store).update).toBe(3);
        });

        it("is ignored after a redo", function() {
            this.store.dispatch(testAction({update : 1}, 1));
            this.store.dispatch(testAction({update : 2}, 2));
            this.store.dispatch(testAction({update : 3}, 2));

            this.store.dispatch(undoAction());
            this.store.dispatch(redoAction());

            this.store.dispatch(testAction({update : 4}, 2));

            this.store.dispatch(undoAction());

            expect(getState(this.store).update).toBe(3);
        });
    });

    describe("autoMerger", function() {
        beforeEach(function() {
            function autoMerger(action : TestAction, prevAction : TestAction) {
                if (!action.state || !prevAction.state) {
                    return false;
                }
                return action.state.update === prevAction.state.update;
            }
            this.store = createStore(createUndoRedoReducer(testReducer, autoMerger));
        });

        it("is respected when no merge keys are provided", function() {
            this.store.dispatch(testAction({update: 1}));
            this.store.dispatch(testAction({update : 2}));
            this.store.dispatch(testAction({update : 2}));

            this.store.dispatch(undoAction());

            expect(getState(this.store).update).toBe(1);
        });

        it("is ignored when previous merge key is non-falsy", function() {
            this.store.dispatch(testAction({update: 1}));
            this.store.dispatch(testAction({update : 2}, 1));
            this.store.dispatch(testAction({update : 2}));

            this.store.dispatch(undoAction());

            expect(getState(this.store).update).toBe(2);
        });

        it("is ignored when a merge key is provided for the action", function() {
            this.store.dispatch(testAction({update: 1}));
            this.store.dispatch(testAction({update : 2}));
            this.store.dispatch(testAction({update : 2}, 1));

            this.store.dispatch(undoAction());

            expect(getState(this.store).update).toBe(2);
        });

        it("is overriden by two equivalent merge keys", function() {
            this.store.dispatch(testAction({update: 1}));
            this.store.dispatch(testAction({update : 2}, 1));
            this.store.dispatch(testAction({update : 3}, 1));

            this.store.dispatch(undoAction());

            expect(getState(this.store).update).toBe(1);
        });

        it("can merge a string of updates", function() {
            this.store.dispatch(testAction({update: 1}));
            this.store.dispatch(testAction({update : 2}));
            this.store.dispatch(testAction({update : 2}));
            this.store.dispatch(testAction({update : 2}));
            this.store.dispatch(testAction({update : 2}));

            this.store.dispatch(undoAction());

            expect(getState(this.store).update).toBe(1);
        });
    });
});
