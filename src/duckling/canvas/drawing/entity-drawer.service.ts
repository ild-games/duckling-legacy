import {Component, Injectable} from '@angular/core';
import {Container, DisplayObject} from 'pixi.js';

import {BaseAttributeService} from '../../entitysystem/base-attribute-service';
import {AssetService} from '../../project';
import {Entity, EntitySystem, Attribute, AttributeKey} from '../../entitysystem/entity';

import {RenderPriorityService} from './render-priority.service';

/**
 * Function type used to draw attributes.
 */
export type AttributeDrawer = (entity : Entity, oldDrawable? : any) => any;

/**
 * The AttributeComponentService is used to find and instantiate a component class
 * for an attribute.
 */
@Injectable()
export class EntityDrawerService extends BaseAttributeService<AttributeDrawer> {
    constructor(private _assets : AssetService,
                private _renderPriority : RenderPriorityService) {
        super();
    }

    /**
     * Get a DisplayObject for the attribute.
     * @param key       Attribute key of the attribute that should be drawn.
     * @param attribute Attribute that needs to be drawn.
     * @return A DisplayObject for the entity.
     */
    drawAttribute(key : AttributeKey, entity : Entity) : DisplayObject {
        var drawer = this.getImplementation(key);
        if (drawer) {
            return drawer(entity, this._assets);
        }
        return null;
    }

    /**
     * Get a DisplayObject for the entity.
     * @param entity Entity that needs to be drawn.
     * @return A DisplayObject for the entity.
     */
    drawEntity(entity : Entity) : DisplayObject {
        var container = new Container();
        for (var key in entity) {
            var drawable = this.drawAttribute(key, entity);
            if (drawable) {
                container.addChild(drawable);
            }
        }
        return container;
    }

    /**
     * Get a function that can map the entitySystem stream into a stage stream.
     * @return A function that can be applied to map the system manager.
     */
    getSystemMapper() {
        return (entitySystem : EntitySystem) : DisplayObject => {
            let stage = new Container();
            this._renderPriority.sortEntities(entitySystem).forEach(entity => this.addDrawableToStage(entity, stage));
            return stage;
        }
    }

    private addDrawableToStage(entity : Entity, stage : Container) {
        let drawable = this.drawEntity(entity);
        if (drawable) {
            stage.addChild(drawable);
        }
    }
}
