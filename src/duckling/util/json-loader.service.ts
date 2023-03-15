import { Injectable } from '@angular/core';
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
  async getJsonFromPath(path: string): Promise<string | null> {
    const exists = await this._path.pathExists(path);
    if (exists) {
      return fs_api.readFile(path, { encoding: 'utf-8' });
    } else {
      return null;
    }
  }

  /**
   * Save a json object to the specified path.
   * @param path Path the object will be saved to.
   * @param json String of Json that is being saved.
   * @returns Promise that resolves to a SaveResult describing the result of the save action.
   */
  async saveJsonToPath(path: string, json: string): Promise<SaveResult> {
    let dirname = this._path.dirname(path);
    await this._path.makedirs(dirname);
    await fs_api.writeFile(path, json);
    return { isSuccess: true, error: null };
  }
}
