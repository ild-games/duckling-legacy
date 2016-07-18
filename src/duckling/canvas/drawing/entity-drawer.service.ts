import {Component, Injectable} from '@angular/core';

import {BaseAttributeService} from '../../entitysystem/base-attribute-service';
import {AssetService} from '../../project';
import {Entity, EntitySystem, Attribute, AttributeKey} from '../../entitysystem/entity';
import {DrawableAttribute, getDrawableAttribute, drawableAttributeSorter} from '../../game/drawable/drawable-attribute';
import {Container, DisplayObject} from 'pixi.js';

/**
 * Sorts the entity system so the render priorities of the entities drawable attributes are
 * respected.
 * @param  entitySystem EntitySystem to sort for drawing
 * @return Array of entities sorted for drawing
 */
export function sortedDrawableEntities(entitySystem : EntitySystem) : Array<Entity> {
    let sortedDrawableAttributeEntities : Entity[] = [];
    let otherEntities : Entity[] = [];
    entitySystem.forEach((entity : Entity) => {
        let drawable : DrawableAttribute = getDrawableAttribute(entity);
        if (drawable && drawable.topDrawable) {
            sortedDrawableAttributeEntities.push(entity);
        } else {
            otherEntities.push(entity)
        }
    });
    sortedDrawableAttributeEntities.sort(drawableAttributeSorter);
    return sortedDrawableAttributeEntities.concat(otherEntities);
}

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
    constructor(private _assets : AssetService) {
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
            sortedDrawableEntities(entitySystem).forEach(entity => this.addDrawableToStage(entity, stage));
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
