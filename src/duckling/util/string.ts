/**
 * Takes in a string and turns it into title case by making the first letter upper case
 * and the rest of the string lower case. Example: joHN becomes John
 * @param  {string} input String to turn into title case.
 * @return {string}       Title cased result
 */
export function toTitleCase(input : string) : string {
    return input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
}
