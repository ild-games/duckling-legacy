/**
 * Module used to perform operations on paths.
 */
module util.path {

    var process = require("process");
    var npath = require("path");
    var fs = require("fs");

    /**
     * Join an array of paths into a single path.
     * @param pathSegments Array of paths.
     */
    export function join(...pathSegments : string[]) : string {
        return npath.join(...pathSegments);
    }

    /**
     * Get the path to the home directory.
     * @returns A path point to the users home.
     */
    export function home() : string {
        return process.env.HOME || process.env.USERPROFILE;
    }

    /**
     * Get the directory of the path.
     * @param path Path string to parse.
     * @returns Path to the directory.
     */
    export function dirname(path : string) : string {
        return npath.dirname(path);
    }


    /**
     * Get the base name from the path (i.e. last directory or file name)
     * @param path Path to get the basename for.
     * @returns The string basename.
     */
    export function basename(path : string) : string {
        return npath.basename(path);
    }

    /**
     * Return a promise that evaluates to true if the path exists.
     * @param path Path to check for existence.
     * @returns A promise that evalutes to true if the path exists or false otherwise.
     */
    export function pathExists(path : string) : Promise<boolean> {
        return new Promise(function(resolve, reject) {
            fs.exists(path,function(exists) {
                resolve(exists);
            });
        });
    }

    /**
     * Checks if a file or directory is a subfile / subdirectory of a given directory.
     *
     * @param subFileOrDir File or directory string to check if it is a subfile / subdirectory of the given parent directory.
     * @param possibleParentDir Directory to check if the subFileOrDir is a subfile / subdirectory of.
     * @returns True if the file / directory is contained in the parent directory.
     */
    export function isSubOfDir(subFileOrDir : string, possibleParentDir : string) : boolean {
        return subFileOrDir.length >= possibleParentDir.length && subFileOrDir.substring(0, possibleParentDir.length) === possibleParentDir;
    }

    /**
     * Make a directory.
     * @param path Path to the directory.  The directory's parents must exist.
     * @returns An empty promise that evaluates once the directory has been created.
     */
    function makedir(path : string) : Promise<any> {
        return new Promise(function(resolve, reject) {
            fs.mkdir(path,function(e) {
                if (!e || e.code === "EEXIST") {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    /**
     * Make a directory and any directories that exist above the directory.
     * @param path
     * @returns An empty promise that resolves once the directory is ready for use.
     */
    export function makedirs(path : string) : Promise<any> {
        return pathExists(path)
            .then(function(exists : boolean) {
                if (exists) {
                    return null;
                } else {
                    return makedirs(dirname(path))
                        .then(function () {
                            return makedir(path);
                        });
                }
            });
    }
}
