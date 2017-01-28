import {Component, Injectable} from '@angular/core';

import {BaseAttributeService} from '../base-attribute.service';
import {AttributeKey, Entity} from '../entity';
import {EntitySystemService} from '../entity-system.service';
import {EntityPositionService} from '../services/entity-position.service';
import {AssetService} from '../../project/asset.service';
import {Box2, boxUnion} from '../../math';
import {immutableAssign} from '../../util';
import {drawnConstructBounds} from '../../canvas/drawing/drawn-construct';
import {drawMissingAsset} from '../../canvas/drawing/util';

/**
 * Function type that provides a bounding box for an attribute.
 */
export type AttributeBoundingBox = (entity : Entity, assetService? : AssetService) => any;

/**
 * The EntityBoxService is used to create boudning boxes for attributes and entitites.
 */
@Injectable()
export class EntityBoxService extends BaseAttributeService<AttributeBoundingBox> {
    constructor(private _asset : AssetService,
                private _entityPosition : EntityPositionService,
                private _entitySystem : EntitySystemService) {
        super();
    }

    /**
     * Get the component class for the attribute.
     * @param  key The key of the attribute the component will be retrieved for.
     * @return The component class to use for the attribute.
     */
    getAttributeBox(key : AttributeKey, entity : Entity) : any {
        let getBox = this.getImplementation(key);
        if (getBox) {
            let box : Box2;
            if (this._asset.areAssetsLoaded(entity, key)) {
                box = getBox(entity, this._asset);
            } else {
                box = drawnConstructBounds(drawMissingAsset(this._asset));
            }

            if (box) {
                box = immutableAssign(box, {
                    position: {
                        x: this._entityPosition.getPosition(entity).x + box.position.x,
                        y: this._entityPosition.getPosition(entity).y + box.position.y
                    } 
                });
            }
            return box;
        }
        return null;
    }

    /**
     * Get the bounding box for an entity.
     * @param  entity Entity the bounding box will be retrieved for.
     * @return A new bounding box instance.
     */
    getEntityBox(entity : Entity) {
        let box : Box2;

        for (let key in entity) {
            let attributeBox = this.getAttributeBox(key, entity);
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
