import {Injectable} from '@angular/core';

import {JsonLoaderService} from '../util/json-loader.service';
import {Action} from './actions';
import {StoreService} from './store.service';

type Options = any;

export interface OptionsState {
    isLoaded : boolean;
    options? : Options;
}

export function optionsReducer(state : OptionsState = {isLoaded : false}, action : Action) {
    switch (action.type) {
        case SET_OPTIONS:
            return {
                isLoaded : true,
                options : (action as SetOptionsAction).options
            }
        default:
            return state;
    }
}

@Injectable()
export class OptionsService {
    constructor(private _jsonLoader : JsonLoaderService,
                private _storeService : StoreService) {

    }

    loadSettings(configFile : string) : Promise<Options> {
        return this._jsonLoader.getJsonFromPath(configFile).then((options) => {
            return JSON.parse(options) || {};
        }).then((options : any) => {
            this._storeService.dispatch({
                type : SET_OPTIONS,
                options : options
            } as SetOptionsAction);
        });
    }

    getSetting<S>(settingKey : string, defaultValue? : S) {
        let settings = this._optionState.options;
        if (settingKey in settings) {
            return settings[settingKey] as S;
        } else {
            return defaultValue;
        }
    }

    get isLoaded() {
        return this._optionState.isLoaded;
    }

    private get _optionState() : OptionsState {
        return this._storeService.getState().options;
    }
}

const SET_OPTIONS = "Options.SetOptions";
interface SetOptionsAction extends Action {
    options : any
}
