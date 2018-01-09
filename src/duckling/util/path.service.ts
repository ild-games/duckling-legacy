import {Injectable} from '@angular/core';
import * as fs from 'fs';
import {posix as npath, sep as osSep} from 'path';

import {glob} from './glob';

@Injectable()
export class PathService {
    /**
     * Join an array of paths into a single path.
     * @param pathSegments Array of paths.
     */
    join(...pathSegments : string[]) : string {
        return npath.join(...pathSegments);
    }

    /**
     * Get the path to the home directory.
     * @returns A path point to the users home.
     */
    home() : string {
        return process.env.HOME || process.env.USERPROFILE;
    }

    /**
     * Get the directory of the path.
     * @param path Path string to parse.
     * @returns Path to the directory.
     */
    dirname(path : string) : string {
        return npath.dirname(path);
    }

    /**
     * Get the base name from the path (i.e. last directory or file name)
     * @param path Path to get the basename for.
     * @returns The string basename.
     */
    basename(path : string) : string {
        return npath.basename(path);
    }

    extname(path : string) : string {
        return npath.extname(path);
    }

    /**
     * Return a promise that evaluates to true if the path exists.
     * @param path Path to check for existence.
     * @returns A promise that evalutes to true if the path exists or false otherwise.
     */
    pathExists(path : string) : Promise<boolean> {
        return new Promise(function(resolve, reject) {
            fs.exists(path,function(exists : boolean) {
                resolve(exists);
            });
        });
    }

    /**
     * Walk a directory and return a promise that evaluates with all the files within
     * that directory and any subdirectories.
     * @param  path to walk
     * @return A promise that evaluates to a list of files within the directory
     */
    walk(path : string) : Promise<any> {
        return glob(`${path}/**/*.*`);
    }

    /**
     * In duckling we frequently store keys that are essentially a relative path to a
     * resource without the extension. This function takes in a path from a directory
     * and returns the key.
     * @param  directory Directory the object (asset or map) is stored in.
     * @param  objectPath Path to the file.
     * @return The key to be stored.
     */
    toKey(directory : string, objectPath : string) : string {
        let relativePath = this.relative(directory, objectPath);
        let extension = npath.extname(objectPath);
        if (extension.length !== 0) {
            return relativePath.slice(0, -extension.length)
        } else {
            return relativePath;
        }
    }

    /**
     * Get the relative path from the first location to the second location.
     * @param  from Directory to look from
     * @param  to   Location to get the path to.
     * @return The relative path.
     */
    relative(from : string, to : string) {
        return npath.relative(from, to);
    }

    /**
     * Normalize the path. Transforms all paths into unix format and simplifies things like dir/../otherdir/file.txt => otherdir/file.txt
     * @param  path Path to normalize.
     * @return Return the normalized path.
     */
    normalize(path : string) : string {
        if (osSep === '\\') {
            path = path.replace(/\\/g, "/");
        }
        return npath.normalize(path);
    }

    /**
     * Checks if a file or directory is a subfile / subdirectory of a given directory.
     *
     * @param subFileOrDir File or directory string to check if it is a subfile / subdirectory of the given parent directory.
     * @param possibleParentDir Directory to check if the subFileOrDir is a subfile / subdirectory of.
     * @returns True if the file / directory is contained in the parent directory.
     */
    isSubOfDir(subFileOrDir : string, possibleParentDir : string) : boolean {
        return subFileOrDir.length >= possibleParentDir.length && subFileOrDir.substring(0, possibleParentDir.length) === possibleParentDir;
    }

    addExtension(path : string, extension : string) : string {
        return path + "." + extension;
    }

    /**
     * Make a directory.
     * @param path Path to the directory.  The directory's parents must exist.
     * @returns An empty promise that evaluates once the directory has been created.
     */
    private _makedir(path : string) : Promise<any> {
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
    makedirs(path : string) : Promise<any> {
        return this.pathExists(path)
            .then((exists : boolean) => {
                if (exists) {
                    return null;
                } else {
                    return this.makedirs(this.dirname(path))
                        .then(() => {
                            return this._makedir(path);
                        });
                }
            });
    }

    /**
     * Get the OS dependent folder separator
     */
    get folderSeparator() : string {
        return npath.sep;
    }
}
