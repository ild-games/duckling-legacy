import { Action } from "../../duckling/state";
import "mocha";
import { expect } from "chai";

const TEST_ACTION = "Test.Action";

export interface TestAction extends Action {
    state: any;
}

export function testAction(state: any, mergeKey?: any): TestAction {
    return {
        state,
        mergeKey,
        type: TEST_ACTION,
    };
}

export function testReducer(
    state: any = { isDefaultState: true },
    action: TestAction
): any {
    switch (action.type) {
        case TEST_ACTION:
            return action.state;
    }
    return state;
}
