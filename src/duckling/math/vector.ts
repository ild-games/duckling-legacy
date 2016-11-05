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
    };
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
    };
}

/**
 * Multiply two vectors
 * @param  vectorA First vector to multiply
 * @param  vectorB Second vector to multiply
 * @return Resulting vector from the multiplication
 */
export function vectorMultiply(vectorA : Vector, vectorB: Vector) : Vector {
    return {
        x: vectorA.x * vectorB.x,
        y: vectorA.y * vectorB.y
    };
}

/**
 * Divide two vectors
 * @param  vectorA First vector to divide
 * @param  vectorB Second vector to divide
 * @return Resulting vector from the division
 */
export function vectorDivide(vectorA : Vector, vectorB: Vector) : Vector {
    return {
        x: vectorA.x / vectorB.x,
        y: vectorA.y / vectorB.y
    };
}

/**
 * Get the absolute value of a vector
 * @param  vector Vector to get the absolute value of
 * @return Resulting vector from the absolute value operation
 */
export function vectorAbsolute(vector : Vector) : Vector {
    return {
        x: Math.abs(vector.x),
        y: Math.abs(vector.y),
    };
}

/**
 * Get the sign value of a vector
 * @param  vector Vector to get the sign value of
 * @return Resulting vector with the sign values
 */
export function vectorSign(vector : Vector) : Vector {
    return {
        x: Math.sign(vector.x),
        y: Math.sign(vector.y)
    }
}

export function vectorToString(vector : Vector) : string {
    return `{x: ${vector.x}, y: ${vector.y}}`;
}
