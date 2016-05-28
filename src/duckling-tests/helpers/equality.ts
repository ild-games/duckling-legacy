import {ChangeType, changeType} from '../../duckling/state/object-diff';

export function isDeepEqual(a : any, b : any) {
    return changeType(a, b) === ChangeType.Equal;
}
