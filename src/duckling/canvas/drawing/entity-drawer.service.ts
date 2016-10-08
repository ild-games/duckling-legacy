import {Component, Injectable} from '@angular/core';
import {Container, DisplayObject} from 'pixi.js';

import {BaseAttributeService} from '../../entitysystem/base-attribute.service';
import {AssetService} from '../../project';
import {Entity, EntitySystem, Attribute, AttributeKey, EntityPositionService, EntitySystemService} from '../../entitysystem';
import {drawMissingAsset} from '../../canvas/drawing/util';

import {RenderPriorityService} from './render-priority.service';
import {DrawnConstruct, setConstructPosition} from './drawn-construct';

/**
 * Function type used to draw attributes.
 */
export type AttributeDrawer = (entity : Entity, assetService? : any) => DrawnConstruct;

/**
 * The AttributeComponentService is used to find and instantiate a component class
 * for an attribute.
 */
@Injectable()
export class EntityDrawerService extends BaseAttributeService<AttributeDrawer> {
    constructor(private _assets : AssetService,
                private _renderPriority : RenderPriorityService,
                private _entityPosition : EntityPositionService,
                private _entitySystem : EntitySystemService) {
        super();
    }

    /**
     * Get a DisplayObject for the attribute.
     * @param key Attribute key of the attribute that should be drawn.
     * @param attribute Attribute that needs to be drawn.
     * @return A DrawnConstruct that describes how an entity is drawn.
     */
    drawAttribute(key : AttributeKey, entity : Entity) : DrawnConstruct {
        let drawer = this.getImplementation(key);
        if (drawer) {
            let drawnConstruct : DrawnConstruct;
            if (this._assets.areAssetsLoaded(entity, key)) {
                drawnConstruct = drawer(entity, this._assets);
            } else {
                drawnConstruct = drawMissingAsset(this._assets);
            }

            if (drawnConstruct) {
                setConstructPosition(
                    drawnConstruct,
                    this._entityPosition.getPosition(this._entitySystem.getKey(entity)));
            }
            return drawnConstruct;
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
            let drawableConstruct = this.drawAttribute(key, entity);
            if (drawableConstruct) {
                drawnConstructs.push(drawableConstruct);
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
