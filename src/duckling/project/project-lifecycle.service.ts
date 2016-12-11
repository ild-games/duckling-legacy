import {Injectable} from '@angular/core';

import {RawMapFile} from './map-parser.service';

export interface MapLifecycleHook {
    (map : RawMapFile) : Promise<RawMapFile>;
}

/**
 */
@Injectable()
export class ProjectLifecycleService {
    private _afterMapLoad : MapLifecycleHook[] = [];
    private _beforeMapSave : MapLifecycleHook[] = []; 

    async executeAfterMapLoad(map : RawMapFile) : Promise<RawMapFile> {
        for (let hook of this._afterMapLoad) {
            map = await hook(map);
        }
        return map;
    }

    async executeBeforeMapSave(map : RawMapFile) : Promise<RawMapFile> {
        for (let hook of this._beforeMapSave) {
            map = await hook(map);
        }
        return map;
    }

    addAfterMapLoadHook(hook : MapLifecycleHook) {
        this._afterMapLoad.push(hook);
    }
    
    addBeforeMapSaveHook(hook : MapLifecycleHook) {
        this._beforeMapSave.push(hook);
    }
}