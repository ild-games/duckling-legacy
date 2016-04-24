import {Injectable, EventEmitter} from 'angular2/core';
import {EntitySystem, Entity, EntityKey, createEntitySystem} from './entity';

import {Subject, BehaviorSubject} from 'rxjs';

@Injectable()
export class EntitySystemService {
    private _entitySystem : EntitySystem = createEntitySystem();
    entitySystem : BehaviorSubject<EntitySystem> = new BehaviorSubject(this._entitySystem);

    constructor() {
        this.loadSystem("DEADBEAF");
    }

    updateEntity(key : EntityKey, entity : Entity) {
        this._entitySystem = this._entitySystem.set(key, entity);
        this.publishChange();
    }

    loadSystem(path : string) {
        this._entitySystem = this.fromJson(system);
        this.publishChange();
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
                }
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
                }
            },
            bodyType: 2,
            collisionType: 2
        }
    }
}
