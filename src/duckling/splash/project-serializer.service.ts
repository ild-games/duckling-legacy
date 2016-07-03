import {Injectable} from '@angular/core';

import {JsonLoaderService} from '../util';

/**
 * Service to load and save the project list for the splash screen.
 */
@Injectable()
export class ProjectSerializerService {
    constructor(private _jsonLoader : JsonLoaderService) {
    }

    /**
     * Load the projects from the specified path.
     * @param  {string}       projectListFile Location of the project list file.
     * @return {Promise<any>}                 Promise resulting in the array of project models.
     */
    loadProjects(projectListFile : string) : Promise<any> {
        return this._jsonLoader.getJsonFromPath(projectListFile).then(this.successfulLoad, this.failedLoad);
    }

    /**
     * Saves the specified project models to the specified file.
     * @param  {string}     projectListFile Location of the project list file.
     * @param  {Array<any>} projects        Array of project models to save.
     */
    saveProjects(projectListFile : string, projects : Array<any>) {
        return this._jsonLoader.saveJsonToPath(projectListFile, JSON.stringify(projects));
    }

    private successfulLoad(json : string) : Array<any> {
        if (json) {
            return JSON.parse(json);
        } else {
            return [];
        }
    }

    private failedLoad(error : string) : Array<any> {
        return [];
    }
}
