import {Injectable} from '@angular/core';

import {RawMapFile} from './map-parser.service';

export interface MapLifecycleHook {
    (map : RawMapFile) : Promise<RawMapFile>;
}

/**
 * Service for storing and executing map post-load and pre-save hooks
 */
@Injectable()
export class ProjectLifecycleService {
    private _postLoadHooks : MapLifecycleHook[] = [];
    private _preSaveHooks : MapLifecycleHook[] = []; 

    async executePostLoadMapHooks(map : RawMapFile) : Promise<RawMapFile> {
        for (let hook of this._postLoadHooks) {
            map = await hook(map);
        }
        return map;
    }

    async executePreSaveMapHooks(map : RawMapFile) : Promise<RawMapFile> {
        for (let hook of this._preSaveHooks) {
            map = await hook(map);
        }
        return map;
    }

    addPostLoadMapHook(hook : MapLifecycleHook) {
        this._postLoadHooks.push(hook);
    }
    
    addPreSaveMapHook(hook : MapLifecycleHook) {
        this._preSaveHooks.push(hook);
    }
}