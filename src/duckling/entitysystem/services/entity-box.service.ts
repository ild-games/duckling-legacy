import {Component, Injectable} from '@angular/core';

import {BaseAttributeService} from '../base-attribute-service';
import {AttributeKey, Entity} from '../entity';
import {AssetService} from '../../project';
import {Box2, boxUnion} from '../../math';

/**
 * Function type that provides a bounding box for an attribute.
 */
export type AttributeBoundingBox = (entity : Entity) => any;

/**
 * The EntityBoxService is used to create boudning boxes for attributes and entitites.
 */
@Injectable()
export class EntityBoxService extends BaseAttributeService<AttributeBoundingBox> {
    constructor(private _asset : AssetService) {
        super();
    }

    /**
     * Get the component class for the attribute.
     * @param  key The key of the attribute the component will be retrieved for.
     * @return The component class to use for the attribute.
     */
    getAttributeBox(key : AttributeKey, entity : Entity) : any {
        var getBox = this.getImplementation(key);
        if (getBox) {
            return getBox(entity, this._asset);
        }
        return null;
    }

    /**
     * Get the bounding box for an entity.
     * @param  entity Entity the bounding box will be retrieved for.
     * @return A new bounding box instance.
     */
    getEntityBox(entity : Entity) {
        var box : Box2;

        for (var key in entity) {
            var attributeBox = this.getAttributeBox(key, entity);
            if (attributeBox) {
                if (!box) {
                    box = attributeBox;
                } else {
                    box = boxUnion(box, attributeBox);
                }
            }
        }

        return box;
    }
}
