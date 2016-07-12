export interface Color {
    r: number,
    g: number,
    b: number,
    a: number
}

/**
 * Converts an rgb color to a hex string
 * @param color Color to convert
 * @return hex string of the given rgb color (no # at the beginning)
 */
export function colorToHex(color : Color) : string {
    let red = (color.r & 255) << 16;
    let green = (color.g & 255) << 8;
    let blue = (color.b & 255);
    let hexString = (red + green + blue).toString(16).toUpperCase();
    if (hexString.length === 5) {
        hexString = "0" + hexString;
    }
    return hexString;
}
