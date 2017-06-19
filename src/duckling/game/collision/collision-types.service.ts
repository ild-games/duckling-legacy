import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {BaseAttributeService} from '../../entitysystem/base-attribute.service';
import {Entity, AttributeKey, EntitySystem, EntityKey} from '../../entitysystem/entity';
import {RawMapFile} from '../../project/map-parser.service';
import {StoreService} from '../../state/store.service';
import {Action} from '../../state/actions';
import {JsonLoaderService} from '../../util/json-loader.service';
import {ProjectService} from '../../project/project.service';
import {SnackBarService} from '../../project/snackbar.service';

import {getCollision} from './collision-attribute';

export type CollisionTypeGetter = (entity : Entity) => string;
export const NONE_COLLISION_TYPE = "none";

interface CollisionTypeMetaData {
    collisionTypes: Set<string>
}

/**
 * This service can be used to get the collision types for an entity or all unique collision types in an entity system
 */
@Injectable()
export class CollisionTypesService {
    collisionTypes = new BehaviorSubject<Set<string>>(new Set<string>([]));
    
    constructor(private _jsonLoader : JsonLoaderService,
                private _store : StoreService,
                private _project : ProjectService,
                private _snackbar : SnackBarService) {
        this._store.state.subscribe(state => {
            if (state.collision.collisionTypes) {
                this.collisionTypes.next(state.collision.collisionTypes);
            }
        });
    }

    async postLoadMapHook(map : RawMapFile)  : Promise<RawMapFile> {
        let json = await this._jsonLoader.getJsonFromPath(this._project.getProjectMetaDataPath("collision-types"));
        if (this._tryParseJsonFile(json)) {
            this._registerAnconaCollisionTypes(JSON.parse(json));
        } else {
            this._notifyFileError("Error: collision-types.json not properly formatted!");
        }
        let unknownCollisionTypes = this._findUnknownCollisionTypes(map);
        this._registerCollisionTypes(unknownCollisionTypes);
        this._notifyUnknownCollisionTypes(unknownCollisionTypes);
        return Promise.resolve(map);
    }
    
    async preSaveMapHook(map : RawMapFile) : Promise<RawMapFile> {
        this._saveCollisionTypesMetaData();
        return Promise.resolve(map);
    }
    
    getCollisionTypeForEntity(entity : Entity) : string {
        let collisionAttribute = getCollision(entity);
        if (!collisionAttribute) {
            return null;
        }
        return collisionAttribute.collisionType;
    }

    addCollisionType(collisionType : string) {
        this._registerCollisionTypes([collisionType]);
    }

    editCollisionType(oldValue : string, newValue : string) {
        if (!this.collisionTypes.value.has(oldValue)) {
            throw new Error(`Attempt to edit collision type that is not registered: ${oldValue}`);
        }
        let newCollisionTypes = Array.from(this.collisionTypes.value.values());
        for (let i = 0; i < newCollisionTypes.length; i++) {
            if (newCollisionTypes[i] === oldValue) {
                newCollisionTypes[i] = newValue;
            }
        }
        this._store.dispatch(_collisionTypesAction(new Set<string>(newCollisionTypes)));
    }

    private _registerAnconaCollisionTypes(collisionTypeMetaData : CollisionTypeMetaData) {
        let collisionTypes = [NONE_COLLISION_TYPE];
        if (collisionTypeMetaData) {
            for (let collisionType of collisionTypeMetaData.collisionTypes) {
                if (collisionType !== NONE_COLLISION_TYPE) {
                    collisionTypes.push(collisionType);
                }
            }
        }
        this._registerCollisionTypes(collisionTypes);
    }

    private _registerCollisionTypes(collisionTypes : string[]) {
        let newCollisionTypes = new Set<string>(this.collisionTypes.getValue());
        collisionTypes.forEach(type => newCollisionTypes.add(type));
        this._store.dispatch(_collisionTypesAction(new Set<string>(newCollisionTypes)));
    }

    private _notifyUnknownCollisionTypes(unknownCollisionTypes : string[]) {
        for (let type of unknownCollisionTypes) {
            this._snackbar.addSnack(`Unknown collision type registered from map: ${type}`);
        }
    }

    private _notifyFileError(message : string) {
        this._snackbar.addSnack(message);
    }

    private _findUnknownCollisionTypes(map : RawMapFile) : string[] {
        let rawMapCollisionTypes = this._getUniqueCollisionTypesInRawMapFile(map);
        let unknownCollisionTypes : string[] = [];
        if (rawMapCollisionTypes) {
            for (let type of rawMapCollisionTypes) {
                if (!this.collisionTypes.getValue().has(type)) {
                    unknownCollisionTypes.push(type);
                }
            }
        }
        return unknownCollisionTypes;
    }

    private _getUniqueCollisionTypesInRawMapFile(map : RawMapFile) : string[] {
        if (!map.systems["collision"] || !map.systems["collision"]["components"]) {
            return;
        }
        let collisionAttributes = map.systems["collision"]["components"];
        
        let collisionTypes = new Set<string>();
        for (let rawEntityAttribute in collisionAttributes) {
            collisionTypes.add(collisionAttributes[rawEntityAttribute]["collisionType"]);
        }
        return Array.from(collisionTypes.values());
    }

    private _saveCollisionTypesMetaData() {
        let json = JSON.stringify({collisionTypes: Array.from(this.collisionTypes.getValue().values())}, null, 4);
        this._jsonLoader.saveJsonToPath(this._project.getProjectMetaDataPath("collision-types"), json);
    }

    private _tryParseJsonFile(jsonStream : string) : boolean {
        try {
            JSON.parse(jsonStream);
        } catch (e) {
            if (e instanceof SyntaxError) {
                return false; 
            } else {
                throw new Error(e);
            }
        }
        return true;
    }
}

//////////////////////////////////////////////////////////////
// Reducer and action for storing collision types in the store
interface CollisionTypesState {
    collisionTypes?: Set<string>;
}

export function collisionTypesReducer(state: CollisionTypesState = {}, action: CollisionTypesAction) {
    if (action.type === ACTION_CHANGE_COLLISION_TYPES) {
        return {
            collisionTypes: action.collisionTypes
        }
    }
    return state;
}

const ACTION_CHANGE_COLLISION_TYPES = "CollisionTypes.ChangeTypes";
interface CollisionTypesAction extends Action {
    collisionTypes?: string[];
}
function _collisionTypesAction(newCollisionTypes: Set<string>) {
    return {
        collisionTypes: newCollisionTypes,
        type: ACTION_CHANGE_COLLISION_TYPES
    }
}