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
    collisionTypes: string[]
}

/**
 * This service can be used to get the collision types for an entity or all unique collision types in an entity system
 */
@Injectable()
export class CollisionTypesService {
    collisionTypes = new BehaviorSubject<string[]>([]);
    
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
        let json = await this._jsonLoader.getJsonFromPath(this._project.getMetaDataPath("collision-types"));
        if (this._tryParseJsonFile(json)) {
            this._registerAnconaCollisionTypes(JSON.parse(json));
        } else {
            this._notifyFileError("Error: collision-types.json not properly formatted!");
        }
        let unknownCollisionTypes = this._findUnknownCollisionTypes(map);
        this._registerMultipleCollisionTypes(unknownCollisionTypes);
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
        this._store.dispatch(_collisionTypesAction(Array.from(this.collisionTypes.getValue().concat([collisionType]))));
    }

    private _registerAnconaCollisionTypes(collisionTypeMetaData : CollisionTypeMetaData) {
        let collisionTypes = new Set<string>([NONE_COLLISION_TYPE]);
        if (collisionTypeMetaData) {
            for (let collisionType of collisionTypeMetaData.collisionTypes) {
                if (collisionType !== NONE_COLLISION_TYPE) {
                    collisionTypes.add(collisionType);
                }
            }
        }
        this._registerMultipleCollisionTypes(Array.from(collisionTypes.values()));
    }

    private _registerMultipleCollisionTypes(collisionTypes : string[]) {
        this._store.dispatch(_collisionTypesAction(Array.from(this.collisionTypes.getValue()).concat(collisionTypes)));
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
                if (this.collisionTypes.getValue().indexOf(type) === -1) {
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
        let json = JSON.stringify({collisionTypes: this.collisionTypes.getValue()}, null, 4);
        this._jsonLoader.saveJsonToPath(this._project.getMetaDataPath("collision-types"), json);
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
    collisionTypes?: string[];
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
function _collisionTypesAction(newCollisionTypes: string[]) {
    return {
        collisionTypes: newCollisionTypes,
        type: ACTION_CHANGE_COLLISION_TYPES
    }
}