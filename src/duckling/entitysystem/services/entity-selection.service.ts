import {Component, Injectable} from '@angular/core';
import {EntityKey, Entity} from '../entity';
import {EntityBoxService} from './entity-box.service';
import {EntitySystemService} from '../entity-system.service';
import {Vector, boxContainsPoint} from '../../math';

/**
 * The EntitySelectionService is used to select entities.
 */
@Injectable()
export class EntitySelectionService {

    constructor(private _entitySystemService : EntitySystemService,
                private _entityBoxService : EntityBoxService) {

    }

    /**
     * Get the key of the entity that contains the point. If multiple entities contain the
     * point it is not well defined which entity will be returned.
     * @param  position Position that may overlap with an entity.
     * @return The key of the entity contained at the position.
     */
    getEntityKey(position : Vector) : EntityKey {
        var key = this._entitySystemService
            .entitySystem
            .getValue()
            .findKey(entity => this._entityContainsPoint(entity, position));

        if (key) {
            return key;
        } else {
            return null;
        }
    }

    private _entityContainsPoint(entity : Entity, position : Vector) {
        return boxContainsPoint(this._entityBoxService.getEntityBox(entity), position);
    }
}
