import {pathExists, dirname, makedirs} from './Path'

var fs = require('fs');

/**
* Describes the result of saving a json object.
*/
export interface SaveResult {
    isSuccess : boolean;
    error : any;
}

/**
* Return a promise that resolves to a json string containing the contents of the path.
* @param path Path to retrieve data from.
* @returns Promise resolving to the json string if it exists or null if it does not.
*/
export function getJsonFromPath(path : string) : Promise<string> {
    return pathExists(path).then(function (exists) {
        if (exists) {
            return new Promise<string>(function (resolve, reject) {
                fs.readFile(path, function(err, data) {
                    if (err) {
                        reject({ error : true});
                    } else {
                        resolve(data);
                    }
                });
            });
        } else {
            return null;
        }
    });
}

/**
* Save a json object to the specified path.
* @param path Path the object will be saved to.
* @param json String of Json that is being saved.
* @returns Promise that resolves to a SaveResult describing the result of the save action.
*/
export function saveJsonToPath(path : string, json : string) : Promise<SaveResult> {
    var dir = dirname(path);
    return makedirs(dir).then(function() {
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
