/**
 * Enum used to describes the difference between two objects.
 */
export enum ChangeType {
    /**
     * The two objects are deeply equivalent
     */
    Equal,
    /**
     * The two objects have one primitive difference.
     */
    PrimitiveChange,
    /**
     * The two objects are different and the difference is greater than the mutation of a primitive field.
     */
    ComplexChange,
}

/**
 * Given two objects determine what type of change was made to beforeObject to turn it
 * into afterObject. Assumes the objects were mutated in an immutable fashion.
 * @param  beforeObject The object before a change was made.
 * @param  afterObject The object after a change was made.
 * @return The type of change that was made to beforeObject.
 */
export function changeType(beforeObject: any, afterObject: any): ChangeType {
    if (Object.is(beforeObject, afterObject)) {
        return ChangeType.Equal;
    }

    if (_isPrimitive(beforeObject) && _isPrimitive(afterObject)) {
        return ChangeType.PrimitiveChange;
    } else if (_isPrimitive(beforeObject) || _isPrimitive(afterObject)) {
        return ChangeType.ComplexChange;
    }

    let changeA = _checkLeftKeys(beforeObject, afterObject);
    let changeB = _checkLeftKeys(afterObject, beforeObject, true);

    if (
        changeA === ChangeType.ComplexChange ||
        changeB === ChangeType.ComplexChange
    ) {
        return ChangeType.ComplexChange;
    } else if (
        changeA === ChangeType.PrimitiveChange &&
        changeB === ChangeType.PrimitiveChange
    ) {
        return ChangeType.ComplexChange;
    } else if (
        changeA === ChangeType.PrimitiveChange ||
        changeB === ChangeType.PrimitiveChange
    ) {
        return ChangeType.PrimitiveChange;
    } else if (changeA === ChangeType.Equal && changeB === ChangeType.Equal) {
        return ChangeType.Equal;
    } else {
        throw "This should never happen";
    }
}

function _checkLeftKeys(
    leftObject: any,
    rightObject: any,
    ignoreSharedKeys: boolean = false
) {
    let hasPrimitiveChange = false;
    for (let key in leftObject) {
        if (ignoreSharedKeys && key in rightObject) {
            continue;
        }

        let change = changeType(leftObject[key], rightObject[key]);
        if (change === ChangeType.PrimitiveChange) {
            if (hasPrimitiveChange) {
                return ChangeType.ComplexChange;
            } else {
                hasPrimitiveChange = true;
            }
        } else if (change === ChangeType.ComplexChange) {
            return ChangeType.ComplexChange;
        }
    }

    if (hasPrimitiveChange) {
        return ChangeType.PrimitiveChange;
    } else {
        return ChangeType.Equal;
    }
}

function _isObject(value: any) {
    return value !== null && typeof value === typeof {};
}

function _isPrimitive(value: any) {
    return !_isObject(value);
}
