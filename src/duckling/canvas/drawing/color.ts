export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Converts an rgb color to a hex string
 * @param color Color to convert
 * @return hex string of the given rgb color (no # at the beginning)
 */
export function colorToHex(color: Color): string {
  return `${color.r.toString(16)}${color.g.toString(16)}${color.b.toString(
    16
  )}`;
}
