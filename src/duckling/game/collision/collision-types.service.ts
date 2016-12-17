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
    collisionTypes: string
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
    
    /**
     * Get the collision type for a specific entity
     */
    getCollisionTypeForEntity(entity : Entity) : string {
        let collisionAttribute = getCollision(entity);
        if (!collisionAttribute) {
            return null;
        }
        return collisionAttribute.collisionType;
    }

    /**
     * Get all the unique collision types for an entity system
     */
    getUniqueCollisionTypesInEntitySystem(entitySystem : EntitySystem) : string[] {
        let collisionTypes = new Set<string>();
        entitySystem.forEach((entity : Entity, key : EntityKey)  => {
            let collisionType = this.getCollisionTypeForEntity(entity);
            if (collisionType) {
                collisionTypes.add(collisionType);
            }
        });
        return Array.from(collisionTypes.values());
    }

    /**
     * Add a new collision type to the game's collision types
     */
    addCollisionType(collisionType : string) {
        this._store.dispatch(_collisionTypesAction(Array.from(this.collisionTypes.getValue().concat([collisionType]))));
    }

    /**
     * Registers the game collision types from the project/collision-types.json file during
     * the map's after load lifecycle.
     */
    async registerGameCollisionTypes(map : RawMapFile) : Promise<RawMapFile> {
        let json = await this._jsonLoader.getJsonFromPath(this._project.getMetaDataPath("collision-types"));
        let collisionTypes = new Set<string>([NONE_COLLISION_TYPE]);
        if (json) {
            let collisionTypeMetaData : CollisionTypeMetaData = JSON.parse(json);
            for (let collisionType of collisionTypeMetaData.collisionTypes) {
                if (collisionType !== NONE_COLLISION_TYPE) {
                    collisionTypes.add(collisionType);
                }
            }
        }
        
        let unknownCollisionTypes = this._findUnknownCollisionTypes(map, collisionTypes);
        this._notifyUnknownCollisionTypes(unknownCollisionTypes);
        this._store.dispatch(_collisionTypesAction(Array.from(collisionTypes).concat(unknownCollisionTypes)));
        return Promise.resolve(map);
    }

    private _notifyUnknownCollisionTypes(unknownCollisionTypes : string[]) {
        for (let type of unknownCollisionTypes) {
            this._snackbar.addSnack({
                message: `Unknown collision type registered from map: ${type}`, 
                action: "OK"
            });
        }
    }

    private _findUnknownCollisionTypes(map : RawMapFile, existingTypes : Set<string>) : string[] {
        let rawMapCollisionTypes = this._getUniqueCollisionTypesInRawMapFile(map);
        let unknownCollisionTypes : string[] = [];
        if (rawMapCollisionTypes) {
            for (let type of rawMapCollisionTypes) {
                if (!existingTypes.has(type)) {
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

    /**
     * Saves the collision types to project/collision-types.json during the map's
     * before save lifecycle 
     */
    async saveGameCollisionTypes(map : RawMapFile) : Promise<RawMapFile> {
        this._saveCollisionTypesMetaData();
        return Promise.resolve(map);
    }

    private _saveCollisionTypesMetaData() {
        let json = JSON.stringify({collisionTypes: this.collisionTypes.getValue()}, null, 4);
        this._jsonLoader.saveJsonToPath(this._project.getMetaDataPath("collision-types"), json);
    }
}

/* Reducer and action for storing collision types in the store */

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