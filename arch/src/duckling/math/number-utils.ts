/**
 * Check if value is an integer.
 * @param  value Any javascript value.
 * @return True if it value is an integer. False otherwise.
 */
export function isInteger(value: any): value is number {
    return typeof value === "number" && value % 1 === 0;
}

/**
 * Check if value is a number.
 * @param  value Any javascript value.
 * @return True if it value is an number. False otherwise.
 */
export function isNumber(value: any): value is number {
    return typeof value === `number` && !isNaN(value) && isFinite(value);
}

/**
 * Converts degrees to radians
 * @param  degrees Angle in degrees
 * @return Angle in radians
 */
export function degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * Converts radians to degrees
 * @param  radians Angle in radians
 * @return Angle in degrees
 */
export function radiansToDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
}

/**
 * Round to the nearest multiple of the radix.
 * @param  value Number to round.
 * @param  radex The result will be rounded to the nearest multiple of the radex.
 * @return The rounded value.
 */
export function roundToMultiple(value: number, radex: number) {
    return floorToMultiple(value + radex / 2, radex);
}

/**
 * Floor the value to a multiple of the radex.
 * @param  value Value to floor.
 * @param  radex The result will be floored to the nearest lesser multiple of the radex.
 * @return The floored value.
 */
export function floorToMultiple(value: number, radex: number) {
    return value - modulo(value, radex);
}

/**
 * Compute modulo the correct way.
 * @param  value Value to compute the modulo of.
 * @param  divisor Divisor used to compute the modulo.
 * @return value % divisor
 */
export function modulo(value: number, divisor: number) {
    if (value >= 0) {
        return value % divisor;
    } else {
        return (value % divisor) + divisor;
    }
}
