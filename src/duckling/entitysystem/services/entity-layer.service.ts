import {Component, Injectable} from '@angular/core';
import {Attribute, Entity, EntityKey} from '../entity';
import {BaseAttributeService} from '../base-attribute-service';
import {EntitySystemService} from '../entity-system.service';

/**
 * Function type that is used to set a position.
 * @returns Returns the new value of the attribute.
 */
export type LayerGetter = (attribute : Attribute) => Number;

/**
 * The EntityLayerService is used to retrieve the layer of an entity.
 */
@Injectable()
export class EntityLayerService extends BaseAttributeService<LayerGetter> {
    constructor(private _entitySystemService : EntitySystemService) {
        super();
    }

    /**
     * Get the layer of the entity
     * @param entityKey The key of the entity to get the layer from
     */
    getLayer(entityKey: EntityKey) {
        let entity = this._entitySystemService.getEntity(entityKey);

        for (let key in entity) {
            let getLayer = this.getImplementation(key);
            if (getLayer) {
                return getLayer(entity[key]);
            }
        }
    }
}
