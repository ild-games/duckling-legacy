import {Component, Injectable} from '@angular/core';
import {EntityKey, Entity} from '../entity';
import {EntitySystemService} from '../entity-system.service';
import {Vector, boxContainsPoint} from '../../math';
import {RenderPriorityService} from '../../canvas/drawing/render-priority.service';

import {EntityBoxService} from './entity-box.service';
import {EntityLayerService} from './entity-layer.service';

/**
 * The EntitySelectionService is used to select entities.
 */
@Injectable()
export class EntitySelectionService {

    constructor(private _entitySystemService : EntitySystemService,
                private _entityBoxService : EntityBoxService,
                private _renderPriority : RenderPriorityService,
                private _entityLayerService : EntityLayerService) {

    }

    /**
     * Get the key of the entity that contains the point. If multiple entities contain the
     * point it is not well defined which entity will be returned.
     * @param  position Position that may overlap with an entity.
     * @return The key of the entity contained at the position.
     */
    getEntityKey(position : Vector) : EntityKey {
        let entities = Array.from(this._renderPriority.sortEntities(this._entitySystemService.entitySystem.getValue()));
        entities.reverse();
        let visibleEntities : Array<Entity> = this._getVisibleEntities(entities);
        let entity = visibleEntities.find(entity => this._entityContainsPoint(entity, position));
        let key = this._entitySystemService.getKey(entity);

        if (key) {
            return key;
        } else {
            return null;
        }
    }

    private _getVisibleEntities(entities : Array<Entity>) : Array<Entity> {
        let visibleEntities : Array<Entity>;
        for (let entity of entities){
            if (this._entityLayerService.isEntityVisible(entity)){
                visibleEntities.push(entity);
            }
        }
        return visibleEntities;
    }

    private _entityContainsPoint(entity : Entity, position : Vector) {
        return boxContainsPoint(this._entityBoxService.getEntityBox(entity), position);
    }
}
