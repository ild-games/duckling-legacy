/**
 * Assign the patch to the existing object and create a new object without mutating the
 * original or the patch.
 * @returns A new object of the same type as the original object.
 */
export function immutableAssign<T>(existingObject : T, patch : any) : T {
    return Object.freeze(Object.assign({}, existingObject, patch));
}

/**
 * Assigns the patch to the existing array and create a new array without mutating the
 * original or the patch
 * @returns A new array with the patch applied
 */
export function immutableArrayAssign<T>(existingArray : T[], patch : T[]) : T[] {
    return Object.freeze(Object.assign([], existingArray, patch));
}

/**
 * Create a new object that is a copy of the existingObject with the specific key removed.
 * @returns A new object of the same type as the original object with the key removed.
 */
export function immutableDelete<T>(existingObject : T, keyToRemove : string) : T {
    let copy = Object.assign({}, existingObject);
    delete copy[keyToRemove];
    return Object.freeze(copy);
}

/**
 * Create a new object that is a copy of the existingObject with the specific key removed.
 * @returns A new object of the same type as the original object with the key removed.
 */
export function immutableArrayDelete<T>(existingArray : T[], elementToRemove : number) : T[] {
    let head = existingArray.slice(0, elementToRemove);
    let tail = existingArray.slice(elementToRemove + 1, existingArray.length);
    return Object.freeze(head.concat(tail));
}

/**
 * Create a new array with two indices swapped
 * @returns A new array with the two specified indices swapped
 */
export function immutableSwapElements<T>(existingArray : T[], firstIndex : number, secondIndex : number) {
    let copiedArray = Array.from(existingArray);
    let bankedItem = copiedArray[firstIndex];
    copiedArray[firstIndex] = copiedArray[secondIndex];
    copiedArray[secondIndex] = bankedItem;
    return Object.freeze(copiedArray);
}
