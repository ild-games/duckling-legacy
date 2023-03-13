import { Component, Injectable } from "@angular/core";
import { Subscriber } from "rxjs";

import { BaseAttributeService } from "../base-attribute.service";
import { AttributeKey, Attribute, Entity, EntityKey } from "../entity";
import { EntitySystemService } from "../entity-system.service";
import { EntityPositionService } from "../services/entity-position.service";
import { AssetService } from "../../project/asset.service";
import { vectorSubtract, vectorAdd } from "../../math";
import { Box2, boxUnion, EMPTY_BOX } from "../../math/box2";
import { immutableAssign } from "../../util";
import { drawMissingAsset } from "../../canvas/drawing/util";
import { drawnConstructBounds } from "../../canvas/drawing/drawn-construct";
import { resize, resizePoint } from "./resize";
import { EntityDrawerService } from "../../canvas/drawing/entity-drawer.service";

/**
 * Function type that provides a bounding box for an attribute.
 */
export interface AttributeBoundingBox<T> {
    getBox(attribute: T, assetService?: AssetService): Box2;
    setBox?(attribute: T, box: Box2, assetService?: AssetService): T;
}

/**
 * The EntityBoxService is used to create boudning boxes for attributes and entitites.
 */
@Injectable()
export class EntityBoxService extends BaseAttributeService<
    AttributeBoundingBox<Attribute>
> {
    private _entitySystemSubscription: Subscriber<any>;
    private _entityBoxCache: { [entity: string]: Box2 } = {};

    constructor(
        private _asset: AssetService,
        private _entityPosition: EntityPositionService,
        private _entitySystem: EntitySystemService,
        private _entityDrawerService: EntityDrawerService
    ) {
        super();

        this._entitySystemSubscription = this._entitySystem.entitySystem.subscribe(
            (entitySystem) => {
                this._entityBoxCache = {};
            }
        ) as Subscriber<any>;
    }

    /**
     * Get the component class for the attribute.
     * @param  key The key of the attribute the component will be retrieved for.
     * @return The component class to use for the attribute.
     */
    getAttributeBox(key: AttributeKey, entity: Entity): Box2 {
        let implementation = this.getImplementation(key);
        if (implementation) {
            let box: Box2;
            if (this._asset.areAssetsLoaded(entity, key)) {
                box = implementation.getBox(entity[key], this._asset);
            } else {
                box = drawnConstructBounds(drawMissingAsset(this._asset));
            }

            if (box) {
                box = immutableAssign(box, {
                    position: {
                        x:
                            this._entityPosition.getPosition(entity).x +
                            box.position.x,
                        y:
                            this._entityPosition.getPosition(entity).y +
                            box.position.y,
                    },
                });
            }
            return box;
        }
        return null;
    }

    /**
     * Set the entity's bounding box to a new value.
     * @param  entityKey The entity to adjust the bounding box.
     * @param  box Box the entity should be resized to.
     * @param  mergeKey Pass to merge updates on the undo/redo stack.
     */
    setEntityBox(entityKey: EntityKey, box: Box2, mergeKey?: string): Entity {
        let patch: Entity = {};

        let currentBox = this.getEntityBox(entityKey);
        let entity = this._entitySystem.getEntity(entityKey);
        let newPosition = resizePoint(
            currentBox,
            box,
            this._entityPosition.getPosition(entity)
        );

        for (let attributeKey in entity) {
            let implementation = this.getImplementation(attributeKey);
            let attributeBox = this.getAttributeBox(attributeKey, entity);
            if (attributeBox && implementation.setBox) {
                let newAttributeBox = resize(
                    currentBox,
                    box,
                    attributeBox,
                    newPosition
                );
                patch[attributeKey] = implementation.setBox(
                    entity[attributeKey],
                    newAttributeBox,
                    this._asset
                );
            }
        }

        return this._entityPosition.setPosition(
            { ...entity, ...patch },
            newPosition
        );
    }

    /**
     * Get the bounding box for an entity.
     * @param  entity Entity the bounding box will be retrieved for.
     * @return A new bounding box instance.
     */
    getEntityBox(entityKey: EntityKey): Box2 {
        if (this._entityBoxCache[entityKey]) {
            return this._entityBoxCache[entityKey];
        }

        let entity = this._entitySystem.getEntity(entityKey);
        if (!this._entityDrawerService.isEntityVisible(entity)) {
            return null;
        }

        let box: Box2;
        for (let key in entity) {
            if (!this._entityDrawerService.isAttributeVisible(key, entity)) {
                continue;
            }

            let attributeBox = this.getAttributeBox(key, entity);
            if (attributeBox) {
                if (!box) {
                    box = attributeBox;
                } else {
                    box = boxUnion(box, attributeBox);
                }
            }
        }

        if (box) {
            this._entityBoxCache[entityKey] = box;
        }

        return box;
    }

    getEntitiesBoundingBox(entityKeys: EntityKey[]): Box2 {
        if (!entityKeys || entityKeys.length === 0) {
            return null;
        }

        let boundingBox: Box2 = this.getEntityBox(entityKeys[0]);
        for (let i = 1; i < entityKeys.length; i++) {
            boundingBox = boxUnion(
                boundingBox,
                this.getEntityBox(entityKeys[i])
            );
        }
        return boundingBox;
    }
}
