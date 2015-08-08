module util {
    declare var require;
    var fs = require('fs');

    var ignoreSymbol = Symbol("IgnoreWhenSerializing");
    var keySymbol = Symbol("JsonKey");

    /**
     * Describes the result of saving a json object.
     */
    export interface SaveResult {
        isSuccess : boolean;
        error : any;
    }


    interface PropertDescriptor {
        value : any,
        enumerable : boolean,
        configurable : boolean,
        writable : boolean
    }

    /**
     * Decorator that signifies the property should be ignored in the serialization process.
     */
    export function JsonIgnore(object : any, propertyKey : string | symbol) {
        if (!object[ignoreSymbol]) {
            object[ignoreSymbol] = {};
        }
        object[ignoreSymbol][propertyKey] = true;
    }

    /**
     * Decorator that can be used to change the JsonKey of a property.
     * @param key String key that will be used in the resulting json.
     */
    export function JsonKey(key : string) {
        return function(object : any, propertyKey : string | symbol) {
            if (!object[keySymbol]) {
                object[keySymbol] = {};
            }
            object[keySymbol][propertyKey] = key;
        }
    }

    /**
     * Function that can be used as a replacer during serialization to respect the JsonKey and
     * Ignore decorators.
     * @param key The key on the object that is being serialized.
     * @param value The object being serialized.
     */
    export function replacer(key, value) {
        if (this[ignoreSymbol] && this[ignoreSymbol][key]) {
            return undefined;
        }

        if (value && value[keySymbol]) {
            var replacement = {};
            for (var propKey in value) {
                if (propKey in value[keySymbol]) {
                    replacement[value[keySymbol][propKey]] = value[propKey];
                } else {
                    replacement[propKey] = value[propKey];
                }
            }

            if(value[ignoreSymbol]) {
                replacement[ignoreSymbol] = value[ignoreSymbol];
            }

            return replacement;
        }

        return value;
    }

    /**
     * JsonLoader is used to retrieve json strings using a provided path.
     */
    export class JsonLoader {
        /**
         * Return a promise that resolves to a json string containing the contents of the path.
         * @param path Path to retrieve data from.
         * @returns Promise resolving to the string.
         */
        getJsonFromPath(path : string) : Promise<string> {
            var promise = new Promise<string>(function (resolve, reject) {
                fs.readFile(path, function(err, data) {
                    if (err) {
                        reject("");
                    } else {
                        resolve(data);
                    }
                });
            });
            return promise;
        }

        /**
         * Save a json object to the specified path.
         * @param path Path the object will be saved to.
         * @param json String of Json that is being saved.
         * @returns Promise that resolves to a SaveResult describing the result of the save action.
         */
        saveJsonToPath(path : string, json : string) : Promise<SaveResult> {
            var promise = new Promise<SaveResult>(function (resolve, reject) {
                fs.writeFile(path,json, function (err) {
                    if (err) {
                        reject({isSuccess : false, error : err});
                    } else {
                        resolve({isSuccess : true, error : null});
                    }
                });
            });
            return promise;
        }
    }
}
