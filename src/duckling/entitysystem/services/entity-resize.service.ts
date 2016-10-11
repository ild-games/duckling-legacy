import {Injectable} from '@angular/core';

import {Vector} from '../../math';
import {immutableAssign} from '../../util';
import {BaseAttributeService} from '../base-attribute.service';
import {EntitySystemService} from '../entity-system.service';
import {Attribute, Entity, EntityKey} from '../entity';

import {EntityPositionService} from './entity-position.service';

export type ResizerSetter = (attribute : Attribute, lastCoords : Vector, curCoords : Vector) => Attribute;

@Injectable()
export class EntityResizeService extends BaseAttributeService<ResizerSetter> {
    constructor(private _entitySystemService : EntitySystemService,
                private _positionService : EntityPositionService) {
        super();
    }

    resizeEntity(entityKey : EntityKey, lastCoords : Vector, curCoords : Vector, mergeKey? : any) {
        let entity = this._entitySystemService.getEntity(entityKey);
        let patch : Entity = {};
        let position = this._positionService.getPosition(entityKey, mergeKey);

        for (let key in entity) {
            let resizeAttribute = this.getImplementation(key);
            if (resizeAttribute) {
                patch[key] = resizeAttribute(entity[key], lastCoords, curCoords, position);
            }
        }

        this._entitySystemService.updateEntity(entityKey, immutableAssign(entity, patch), mergeKey);
    }
}
