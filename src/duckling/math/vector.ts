export interface Vector {
    x : number,
    y : number
}

/**
 * Add two vectors together
 * @param  vectorA First vector to add
 * @param  vectorB Second vector to add
 * @return Resulting vector from the addition
 */
export function vectorAdd(vectorA : Vector, vectorB : Vector) : Vector {
    return {
        x: vectorA.x + vectorB.x,
        y: vectorA.y + vectorB.y,
    }
}

/**
 * Subtract two vectors
 * @param  vectorA First vector to subtract
 * @param  vectorB Second vector to subtract
 * @return Resulting vector from the subtraction
 */
export function vectorSubtract(vectorA : Vector, vectorB : Vector) : Vector {
    return vectorAdd(vectorA, {x: -vectorB.x, y: -vectorB.y});
}

/**
 * Multiply two vectors
 * @param  vectorA First vector to multiply
 * @param  vectorB Second vector to multiply
 * @return Resulting vector from the multiplication
 */
export function vectorMultiply(vectorA : Vector, vectorB : Vector) : Vector {
    return {
        x: vectorA.x * vectorB.x,
        y: vectorA.y * vectorB.y,
    }
}

/**
 * Get the modulus vector between two vectors
 * @param  vectorA First vector to get the modulus of
 * @param  vectorB Second vector that is the modulus value
 * @return Resulting vector from the modulus
 */
export function vectorModulus(vectorA : Vector, vectorB : Vector) : Vector {
    return {
        x: vectorA.x % vectorB.x,
        y: vectorA.y % vectorB.y,
    }
}


/**
 * Round a vector to the nearest integer
 * @param  vector Vector to round
 * @return Resulting rounded vector
 */
export function vectorRound(vector : Vector) : Vector {
    return {
        x: Math.round(vector.x),
        y: Math.round(vector.y)
    }
}

const ORIGIN = {x: 0, y: 0};
/**
 * Rotate a vector around a given origin
 * @param vector Vector to rotate
 * @param radiansToRotate Amount to rotate by
 * @param origin Point to rotate around
 * @return Resulting vector from the rotation
 */
export function vectorRotate(vector : Vector, radiansToRotate : number, origin : Vector = ORIGIN) : Vector {
    let result : Vector = {x: 0, y: 0};
    let sin = Math.sin(radiansToRotate);
    let cos = Math.cos(radiansToRotate);
    result.x = cos * (vector.x - origin.x) - sin * (vector.y - origin.y) + origin.x;
    result.y = sin * (vector.x - origin.x) + cos * (vector.y - origin.y) + origin.y;
    return result;
}
