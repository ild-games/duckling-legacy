/**
* Formats all the words in a string to Title Case.
*
* @param toFormat The string to format
*
* @returns Title Case variant of the toFormat.
*/
export function formatToTitleCase(toFormat : string) : string {
    var words = toFormat.split(' ');
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
    }
    return words.join(' ');
}

/**
* Produces a map of enum names to enum values to use in the select controls.
*
* @param enumType The enum object to get the values from.
*
* @returns Maps the enum entries to their respective number value.
*/
export function valuesFromEnum(enumType) : any {
    var values = {};
    for (var val in enumType) {
        if (!isNaN(val)) {
            values[enumType[val]] = Number(val);
        }
    }
    return values;
}
