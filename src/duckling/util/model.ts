/**
 * Assign the patch to the existing object and create a new object without mutating the
 * original or the patch.
 * @returns A new object of the same type as the original object.
 */
export function immutableAssign<T>(existingObject : T, patch : any) : T {
    return Object.assign({}, existingObject, patch);
}
