import {Injectable, EventEmitter} from 'angular2/core';
import {BehaviorSubject} from 'rxjs';

import {StoreService, clearUndoHistoryAction} from '../state';
import {EntitySystem, Entity, EntityKey, createEntitySystem} from './entity';
import {updateEntityAction, replaceSystemAction} from './entity-system.reducer';

/**
 * The EntitySystemService is used to provide convinient access to the EntitySystem.
 */
@Injectable()
export class EntitySystemService {
    private _nextKey = 0;
    entitySystem : BehaviorSubject<EntitySystem>;

    constructor(private _storeService : StoreService) {
        this.entitySystem = new BehaviorSubject(this._system);
        this._storeService.state.subscribe((state) => {
            this.entitySystem.next(state.entitySystem);
        });
    }

    /**
     * Retrieve a single entity.
     * @param  key Key of the entitity to retrieve.
     * @return The entity.
     */
    getEntity(key : EntityKey) : Entity {
        return this._system.get(key);
    }

    /**
     * Update the entity. Can be used to create new entities.
     * @param  key    Key of the entity to update.
     * @param  entity Entity that will be stored with the key.
     * @param  mergeKey Used to merge updates.
     */
    updateEntity(key : EntityKey, entity : Entity, mergeKey? : any) {
        this._storeService.dispatch(updateEntityAction(entity, key), mergeKey);
    }

    /**
     * Add a new entity to the entity system.
     * @param  entity The entity that is being added to the system.
     * @param  mergeKey Used to merge updates.
     * @return The key of the newly created entity.
     */
    addNewEntity(entity : Entity, mergeKey? : any) : EntityKey {
        var key = this.nextKey();
        this.updateEntity(key, entity, mergeKey);
        return key;
    }

    /**
     * Load the system stored in the file.
     * @param  path The path the system is stored in.
     */
    loadSystem(path : string) {
        var newSystem = this.fromJson(system); //TODO: Implement correctly!

        this._storeService.dispatch(replaceSystemAction(newSystem));
        this._storeService.dispatch(clearUndoHistoryAction());
    }

    private get _system() : EntitySystem {
        var state = this._storeService.getState();
        if (state && state.entitySystem) {
            return state.entitySystem;
        } else {
            return createEntitySystem();
        }
    }

    private nextKey() : string {
        var next = this._nextKey++;
        while (this._system.get(String(next), null)) {
            next = this._nextKey++;
        }
        return String(next);
    }

    private fromJson(object : any) : EntitySystem {
        return createEntitySystem().withMutations(system => {
            for (var key in object) {
                system.set(key,object[key]);
            }
        });
    }
};

// Mock system that should be deleted once loadSystem is implemented.
var system = {
    entityA: {
        position: {
            position: {
                x: 100,
                y: 200
            },
            velocity: {
                x: 0,
                y: 0
            }
        },
        collision: {
            dimension: {
                position: {
                    x: 0,
                    y: 0
                },
                dimension: {
                    x: 10,
                    y: 10
                },
                rotation: 0
            },
            bodyType: 2,
            collisionType: 2
        }
    },
    entityB : {
        position: {
            position: {
                x: 200,
                y: 250
            },
            velocity: {
                x: 0,
                y: 0
            },
            rotation: 0
        },
        collision: {
            dimension: {
                position: {
                    x: 0,
                    y: 0
                },
                dimension: {
                    x: 10,
                    y: 10
                }
            },
            bodyType: 2,
            collisionType: 2
        }
    }
}
