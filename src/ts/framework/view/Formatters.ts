module framework.view {

    /**
     * Creates the formatters used by bindings throughout the editor.
     *
     * @param window Window context
     * @param rivets The object containing the rivets library.
     */
    export function CreateFormatters(window, rivets) {
        rivets.formatters.formatEnum = {
            /**
             * Read formatter for the selected value of an enum.
             *
             * @param value The number representation of the enum value.
             * @param enumTypeAsString The type (including module) of the enum as a string.
             * @returns The human readable version of the enum value.
             */
            read: function (value:number, enumTypeAsString:string):string {
                if (value === undefined || enumTypeAsString === undefined) {
                    return undefined;
                }

                return getChildOfObjectViaString(window, enumTypeAsString)[value];
            },
            /**
             * Publish formatter for the selected value of an enum.
             *
             * @param value The string representation of the enum value.
             * @param enumTypeAsString The type (including module) of the enum as a string.
             * @returns The number representation of the enum value.
             */
            publish: function (value:number, enumTypeAsString:string):string {
                if (value === undefined || enumTypeAsString === undefined) {
                    return undefined;
                }

                return getChildOfObjectViaString(window, enumTypeAsString)[value];
            }
        };

        /**
         * Translates the number representation of all the enum values into the human
         * readable string versions.
         *
         * @param value array of numbers, all the values for an enum
         * @param enumtypeasstring the type (including module) of the enum as a string.
         * @returns array of human readable string versions of the enum's values.
         */
        rivets.formatters.formatEnumVals = function(value : Array<number>, enumTypeAsString : string) : Array<string> {
            if (value === undefined || enumTypeAsString === undefined) {
                return undefined;
            }

            var shownToUsers : Array<string> = [];
            var enumObj = getChildOfObjectViaString(window, enumTypeAsString);
            for (var i = 0; i < value.length; i++)
            {
                shownToUsers.push(enumObj[i]);
            }
            return shownToUsers;
        };

        /**
         * Given an object, and a period delimited string of the wanted child object, return the wanted
         * child object.
         *
         * @param object Object to start from.
         * @param childObjAsString Desired child object, in the form of a period delimited string. (e.g. "editor.collision.BodyType")
         * @returns The child object if it exists, otherwise undefined
         */
        function getChildOfObjectViaString(object: Object, childObjAsString: string) {
            if (object === undefined) {
                return undefined;
            }

            // This seems to be a bug in rivets. If you pass a variable (in our case the enum type)
            // to the publish formatter, it will keep the surrounding single/double quotes around it.
            // This checks for these and trims them off if they are present.
            var length = childObjAsString.length;
            if ((childObjAsString.charAt(0) === "'" || childObjAsString.charAt(0) === "\"") &&
                (childObjAsString.charAt(length - 1) === "'" || childObjAsString.charAt(length - 1) === "\""))
            {
                childObjAsString = childObjAsString.substr(1, childObjAsString.length - 2);
            }

            if (childObjAsString.indexOf(".") > -1) {
                return getChildOfObjectViaString(
                    object[childObjAsString.split(".")[0]],
                    childObjAsString.substr(childObjAsString.indexOf(".") + 1));
            }

            return object[childObjAsString];
        };
    }
}
/**
 * Formatter for the selected value of an enum.
 */
//rivets.formatters.formatEnum = {
//    /**
//     * Read formatter for the selected value of an enum.
//
//     * @param value The number representation of the enum value.
//     * @param enumTypeAsString The type (including module) of the enum as a string.
//     * @returns The human readable version of the enum value.
//     */
//    read: function(value : number, enumTypeAsString : string) : string {
//        if (value === undefined || enumTypeAsString === undefined) {
//            return undefined;
//        }
//
//        return getChildOfObjectViaString(window, enumTypeAsString)[value];
//    },
//    /**
//     * Publish formatter for the selected value of an enum.
//     *
//     * @param value The string representation of the enum value.
//     * @param enumTypeAsString The type (including module) of the enum as a string.
//     * @returns The number representation of the enum value.
//     */
//    publish: function(value : string, enumTypeAsString : string) : number {
//        if (value === undefined || enumTypeAsString === undefined) {
//            return undefined;
//        }
//
//        return getChildOfObjectViaString(window, enumTypeAsString)[value];
//    }
//}
//
///**
// * Formatter for all the values in for a bindable enum.
// */
//rivets.formatters.formatEnumVals = {
//    /**
//     * translates the number representation of all the enum values into the human
//     * readable string versions
//     *
//     * @param value array of numbers, all the values for an enum
//     * @param enumtypeasstring the type (including module) of the enum as a string.
//     * @returns array of human readable string versions of the enum's values.
//     */
//    read: function(value : Array<number>, enumTypeAsString : string) : Array<string> {
//        if (value === undefined || enumTypeAsString === undefined) {
//            return undefined;
//        }
//
//        var shownToUsers : Array<string> = [];
//        var enumObj = getChildOfObjectViaString(window, enumTypeAsString);
//        for (var i = 0; i < value.length; i++)
//        {
//            shownToUsers.push(enumObj[i]);
//        }
//        return shownToUsers;
//    }
//}
//
///**
// * Given an object, and a period delimited string of the wanted child object, return the wanted
// * child object.
// *
// * @param object Object to start from.
// * @param childObjAsString Desired child object, in the form of a period delimited string. (e.g. "editor.collision.BodyType")
// * @returns The child object if it exists, otherwise undefined
// */
//function getChildOfObjectViaString(object: Object, childObjAsString: string) {
//    if (object === undefined) {
//        return undefined;
//    }
//
//    // This seems to be a bug in rivets. If you pass a variable (in our case the enum type)
//    // to the publish formatter, it will keep the surrounding single/double quotes around it.
//    // This checks for these and trims them off if they are present.
//    var length = childObjAsString.length;
//    if ((childObjAsString.charAt(0) === "'" || childObjAsString.charAt(0) === "\"") &&
//        (childObjAsString.charAt(length - 1) === "'" || childObjAsString.charAt(length - 1) === "\""))
//    {
//        childObjAsString = childObjAsString.substr(1, childObjAsString.length - 2);
//    }
//
//    if (childObjAsString.indexOf(".") > -1) {
//        return getChildOfObjectViaString(
//            object[childObjAsString.split(".")[0]],
//            childObjAsString.substr(childObjAsString.indexOf(".") + 1));
//    }
//
//    return object[childObjAsString];
//}
