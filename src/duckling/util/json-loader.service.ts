import { Injectable } from '@angular/core';
import * as fs from 'fs';

import { PathService } from './path.service';

/**
 * Describes the result of saving a json object.
 */
export interface SaveResult {
  isSuccess: boolean;
  error: any;
}

interface PropertDescriptor {
  value: any;
  enumerable: boolean;
  configurable: boolean;
  writable: boolean;
}

/**
 * JsonLoader is used to retrieve json strings using a provided path.
 */
@Injectable()
export class JsonLoaderService {
  constructor(private _path: PathService) {}

  /**
   * Return a promise that resolves to a json string containing the contents of the path.
   * @param path Path to retrieve data from.
   * @returns Promise resolving to the json string if it exists or null if it does not.
   */
  getJsonFromPath(path: string): Promise<string | null> {
    return this._path.pathExists(path).then(function (exists: boolean) {
      if (exists) {
        return new Promise<string>(function (resolve, reject) {
          fs.readFile(path, function (err, data) {
            if (err) {
              reject({ error: true });
            } else {
              resolve(data.toString());
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
  saveJsonToPath(path: string, json: string): Promise<SaveResult> {
    let dirname = this._path.dirname(path);
    return this._path.makedirs(dirname).then(function () {
      return new Promise<SaveResult>(function (resolve, reject) {
        fs.writeFile(path, json, function (err) {
          if (err) {
            reject({ isSuccess: false, error: err });
          } else {
            resolve({ isSuccess: true, error: null });
          }
        });
      });
    });
  }
}
