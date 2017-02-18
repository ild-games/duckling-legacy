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

export function vectorRotate(vector : Vector, radians : number, origin : Vector = {x: 0, y: 0}) : Vector {
    let result : Vector = {x: 0, y: 0};
    result.x = Math.cos(radians) * (vector.x - origin.x) - Math.sin(radians) * (vector.y - origin.y) + origin.x;
    result.y = Math.sin(radians) * (vector.x - origin.x) + Math.cos(radians) * (vector.y - origin.y) + origin.y;
    return result;
}