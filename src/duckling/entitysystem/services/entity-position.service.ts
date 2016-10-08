import {Component, Injectable} from '@angular/core';
import {Attribute, Entity, EntityKey} from '../entity';
import {BaseAttributeService} from '../base-attribute.service';
import {EntitySystemService} from '../entity-system.service';
import {Vector, boxContainsPoint} from '../../math';
import {immutableAssign} from '../../util';

/**
 * Function type that is used to set a position.
 */
export type PositionSetter = (attribute : Attribute, newPosition : Vector) => Attribute;

/**
 * Function type that is used to get a position
 */
export type PositionGetter = (attribute : Attribute) => Vector;

export type PositionServiceOperations = {
    set: PositionSetter,
    get: PositionGetter
};

/**
 * The EntityPositionService is used to get and set the position on an entity.
 */
@Injectable()
export class EntityPositionService extends BaseAttributeService<PositionServiceOperations> {
    constructor(private _entitySystemService : EntitySystemService) {
        super();
    }

    /**
     * Update the position on the entity.  The update is immutable.
     * @param entityKey The key of the entity that needs to be updated.
     * @param newPosition The position the entity should be moved to.
     */
    setPosition(entityKey : EntityKey, newPosition : Vector, mergeKey? : any) {
        let entity = this._entitySystemService.getEntity(entityKey);
        let patch : Entity = {};

        for (let key in entity) {
            let setPosition = this.getImplementation(key);
            if (setPosition && setPosition.set) {
                patch[key] = setPosition.set(entity[key], newPosition);
            }
        }

        this._entitySystemService.updateEntity(entityKey, immutableAssign(entity, patch), mergeKey);
    }

    /**
     * Get the position on the entity.
     *
     * NOTE: Only one getPosition implementation will be executed. If multiple are registered
     *       it will only return the result of the first one found.
     *
     * @param entityKey The key of the entity to get the position of.
     */
    getPosition(entityKey : EntityKey, mergeKey? : any) {
        let entity = this._entitySystemService.getEntity(entityKey);

        for (let key in entity) {
            let getPosition = this.getImplementation(key);
            if (getPosition && getPosition.get) {
                return getPosition.get(entity[key]);
            }
        }
        return {x: 0, y: 0};
    }
}
