import {Injectable} from '@angular/core';

import {JsonLoaderService} from '../util/json-loader.service';
import {Action} from './actions';
import {StoreService} from './store.service';

type Options = any;

/**
 * State for the Options service.
 */
export interface OptionsState {
    isLoaded : boolean;
    options? : Options;
}

/**
 * Reducer used to update the options state.
 */
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

    /**
     * Load the given settings file. Should be called during the duckling bootstrap
     * process before the project is displayed.
     * @param  configFile The configuration file that will be loaded.
     * @return A promise that resolves once the settings are loaded.
     */
    loadSettings(configFile : string) : Promise<any> {
        return this._jsonLoader.getJsonFromPath(configFile).then((options) => {
            return JSON.parse(options) || {};
        }).then((options : any) => {
            this._storeService.dispatch({
                type : SET_OPTIONS,
                options : options
            } as SetOptionsAction);
        });
    }

    /**
     * Retrieve a specific setting.
     * @param settingKey The setting that is being retrieved.
     * @param defaultValue The value that should be used for a setting if none is provided.
     */
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
