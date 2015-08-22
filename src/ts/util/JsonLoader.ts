module util {
    var fs = require('fs');

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
     * JsonLoader is used to retrieve json strings using a provided path.
     */
    export class JsonLoader {
        /**
         * Return a promise that resolves to a json string containing the contents of the path.
         * @param path Path to retrieve data from.
         * @returns Promise resolving to the string.
         */
        getJsonFromPath(path : string) : Promise<string> {
            return new Promise<string>(function (resolve, reject) {
                fs.readFile(path, function(err, data) {
                    if (err) {
                        reject("");
                    } else {
                        resolve(data);
                    }
                });
            });
        }

        /**
         * Save a json object to the specified path.
         * @param path Path the object will be saved to.
         * @param json String of Json that is being saved.
         * @returns Promise that resolves to a SaveResult describing the result of the save action.
         */
        saveJsonToPath(path : string, json : string) : Promise<SaveResult> {
            var dirname = util.path.dirname(path);
            return util.path.makedirs(dirname).then(function() {
                return new Promise<SaveResult>(function (resolve, reject) {
                    fs.writeFile(path,json, function (err) {
                        if (err) {
                            reject({isSuccess : false, error : err});
                        } else {
                            resolve({isSuccess : true, error : null});
                        }
                    });
                });
            });
        }
    }
}
