import {Injectable, EventEmitter} from 'angular2/core';
import {EntitySystem, Entity, EntityKey, createEntitySystem} from './entity';

import {Subject, BehaviorSubject} from 'rxjs';

/**
 * The EntitySystemService is used to provide convinient access to the EntitySystem.
 */
@Injectable()
export class EntitySystemService {
    private _entitySystem : EntitySystem = createEntitySystem();
    private _nextKey = 0;
    entitySystem : BehaviorSubject<EntitySystem> = new BehaviorSubject(this._entitySystem);

    constructor() {
        this.loadSystem("DEADBEAF");
    }

    /**
     * Retrieve a single entity.
     * @param  key Key of the entitity to retrieve.
     * @return The entity.
     */
    getEntity(key : EntityKey) : Entity {
        return this._entitySystem.get(key);
    }

    /**
     * Update the entity. Can be used to create new entities.
     * @param  key    Key of the entity to update.
     * @param  entity Entity that will be stored with the key.
     */
    updateEntity(key : EntityKey, entity : Entity) {
        this._entitySystem = this._entitySystem.set(key, entity);
        this.publishChange();
    }

    /**
     * Add a new entity to the entity system.
     * @param  entity The entity that is being added to the system.
     * @return The key of the newly created entity.
     */
    addNewEntity(entity : Entity) : EntityKey {
        var key = this.nextKey();
        this.updateEntity(key, entity);
        return key;
    }

    /**
     * Load the system stored in the file.
     * TODO: Implement correctly!
     * @param  path The path the system is stored in.
     */
    loadSystem(path : string) {
        this._entitySystem = this.fromJson(system);
        this.publishChange();
    }

    private nextKey() : string {
        var next = this._nextKey++;
        while (this._entitySystem.get(String(next), null)) {
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

    private publishChange() {
        this.entitySystem.next(this._entitySystem);
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
