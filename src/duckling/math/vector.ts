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
