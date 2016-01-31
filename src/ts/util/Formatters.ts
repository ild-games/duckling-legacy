/*
 * Contains functions used to format data.
 */
module util.formatters {
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

    /**
     * Formatter for a Color object to a string the user can manipulate.
     *
     * @param colorToFormat Color object to transform to the string presented to
     * the user.
     *
     * @returns String formatted to: rgba(r-value,g-value,b-value,a-value)
     */
    export function rgbaRead(colorToFormat : entityframework.components.drawing.Color) : string {
        return "rgba(" + colorToFormat.r + "," + colorToFormat.g + "," + colorToFormat.b + "," + colorToFormat.a / 255 + ")";
    }

    /**
     * Takes the formatted rgba string and creates a Color object out of it.
     *
     * @param formattedString string to create the Color object from.
     *
     * @returns Color object from formattedString.
     */
    export function rgbaPublish(formattedString : string) : entityframework.components.drawing.Color {
        var numsAsStrings = formattedString.match(/[0-9 \.]+/g);
        var color = new entityframework.components.drawing.Color(0,0,0,0);
        if (numsAsStrings.length >= 4) {
            color.r = parseInt(numsAsStrings[0]);
            color.g = parseInt(numsAsStrings[1]);
            color.b = parseInt(numsAsStrings[2]);
            color.a = 255 * parseFloat(numsAsStrings[3]);
        }
        return color;
    }
}

/**
 * Object to setup the various rivets formatters.
 */
rivets.formatters = {
    /**
     * Formatter for color picker rgba control.
     */
    rgba: {
        read: util.formatters.rgbaRead,
        publish: util.formatters.rgbaPublish,
    }
}
