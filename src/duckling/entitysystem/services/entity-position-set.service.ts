import {Component, Injectable} from '@angular/core';
import {Attribute, Entity, EntityKey} from '../entity';
import {BaseAttributeService} from '../base-attribute-service';
import {EntitySystemService} from '../entity-system.service';
import {Vector, boxContainsPoint} from '../../math';
import {immutableAssign} from '../../util';

/**
 * Function type that is used to set a position.
 * @returns Returns the new value of the attribute.
 */
export type PositionSetter = (attribute : Attribute, newPosition : Position) => Attribute;

/**
 * The EntityPositionSetService is used to set the position on an entity.
 */
@Injectable()
export class EntityPositionSetService extends BaseAttributeService<PositionSetter> {
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
            if (setPosition) {
                patch[key] = setPosition(entity[key], newPosition);
            }
        }

        this._entitySystemService.updateEntity(entityKey, immutableAssign(entity, patch), mergeKey);
    }
}
