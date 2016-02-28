/**
* Test if the value is a primitive (Number, String, or Boolean)
* @param value Value to test to see if it is a primitive.
*/
export function isPrimitive(value : any) {
    return !(Array.isArray(value) || typeof value === typeof{});
}

/**
* Return true if the value is an array.
* @param value Value to be type checked.
* @returns True if the value is an array.
*/
export function isArray(value : any) {
    return Array.isArray(value);
}

/**
* Test if the value is an object. (Note: Arrays are excluded)
* @param value Value to be type checked.
* @returns True if the value is an object.
*/
export function isObject(value : any) {
    return !isArray(value) && (typeof value === typeof {});
}
