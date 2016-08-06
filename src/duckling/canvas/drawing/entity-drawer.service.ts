import {Component, Injectable} from '@angular/core';
import {Container, DisplayObject} from 'pixi.js';

import {BaseAttributeService} from '../../entitysystem/base-attribute-service';
import {AssetService, RequiredAssetService} from '../../project';
import {Entity, EntitySystem, Attribute, AttributeKey} from '../../entitysystem/entity';

import {RenderPriorityService} from './render-priority.service';
import {Animation, DrawnConstruct} from './drawn-construct';

/**
 * Function type used to draw attributes.
 */
export type AttributeDrawer = (entity : Entity, assetService? : any) => DrawnConstruct[] | DrawnConstruct;

/**
 * The AttributeComponentService is used to find and instantiate a component class
 * for an attribute.
 */
@Injectable()
export class EntityDrawerService extends BaseAttributeService<AttributeDrawer> {
    constructor(private _assets : AssetService,
                private _requiredAssets : RequiredAssetService,
                private _renderPriority : RenderPriorityService) {
        super();
    }

    /**
     * Get a DisplayObject for the attribute.
     * @param key       Attribute key of the attribute that should be drawn.
     * @param attribute Attribute that needs to be drawn.
     * @return A DisplayObject for the entity.
     */
    drawAttribute(key : AttributeKey, entity : Entity) : DrawnConstruct[] | DrawnConstruct {
        let drawer = this.getImplementation(key);
        if (drawer) {
            let requiredAssets = this._requiredAssets.assetsForAttribute(key, entity);
            let needsLoading = false;
            for (let assetKey in requiredAssets) {
                if (!this._assets.isLoaded(assetKey)) {
                    needsLoading = true;
                    this._assets.add(requiredAssets[assetKey]);
                }
            };
            if (!needsLoading) {
                return drawer(entity, this._assets);
            }
        }
        return null;
    }


    /**
     * Get a DisplayObject for the entity.
     * @param entity Entity that needs to be drawn.
     * @return A DisplayObject for the entity.
     */
    drawEntity(entity : Entity) : DrawnConstruct[] {
        let drawnConstructs : DrawnConstruct[] = [];
        for (let key in entity) {
            let drawablePieces = this.drawAttribute(key, entity);
            if (drawablePieces) {
                if (Array.isArray(drawablePieces)) {
                    drawnConstructs = drawnConstructs.concat(drawablePieces as DrawnConstruct[]);
                } else {
                    drawnConstructs.push(drawablePieces as DrawnConstruct);
                }
            }
        }
        return drawnConstructs;
    }

    /**
     * Get a function that can map the entitySystem stream into a stage stream.
     * @return A function that can be applied to map the system manager.
     */
    getSystemMapper() {
        return (entitySystem : EntitySystem) : DrawnConstruct[] => {
            let drawnConstructs : DrawnConstruct[] = [];
            this._renderPriority.sortEntities(entitySystem).forEach(entity => drawnConstructs = drawnConstructs.concat(this.drawEntity(entity)));
            return drawnConstructs;
        }
    }
}
