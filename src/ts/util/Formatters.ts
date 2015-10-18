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
}
