/**
 * Assign the patch to the existing object and create a new object without mutating the
 * original or the patch.
 * @returns A new object of the same type as the original object.
 */
export function immutableAssign<T>(existingObject : T, patch : any) : T {
    return Object.assign({}, existingObject, patch);
}

/**
 * Create a new object that is a copy of the existingObject with the specific key removed.
 * @returns A new object of the same type as the original object with the key removed.
 */
export function immutableDelete<T>(existingObject : T, keyToRemove : string) : T {
    var copy = Object.assign({}, existingObject);
    delete copy[keyToRemove];
    return copy;
}
