import {Component, Injectable} from '@angular/core';

import {BaseAttributeService} from '../../entitysystem/base-attribute-service';
import {Entity, EntitySystem, Attribute, AttributeKey} from '../../entitysystem/entity';
import {Container, DisplayObject} from 'pixi.js';

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
    /**
     * Get a DisplayObject for the attribute.
     * @param key       Attribute key of the attribute that should be drawn.
     * @param attribute Attribute that needs to be drawn.
     * @return A DisplayObject for the entity.
     */
    drawAttribute(key : AttributeKey, entity : Entity) : DisplayObject {
        var drawer = this.getImplementation(key);
        if (drawer) {
            return drawer(entity);
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
            var stage = new Container();
            entitySystem.forEach((entity : Entity) => {
                var drawable = this.drawEntity(entity);
                if (drawable) {
                    stage.addChild(drawable);
                }
            });
            return stage;
        }
    }
}
