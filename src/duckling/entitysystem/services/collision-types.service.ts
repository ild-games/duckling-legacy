import {Injectable} from '@angular/core';

import {BaseAttributeService} from '../../entitysystem/base-attribute.service';
import {Entity, AttributeKey, EntitySystem, EntityKey} from '../../entitysystem/entity';

export type CollisionTypeGetter = (entity : Entity) => string;

/**
 * This service can be used to get the collision types for an entity or all unique collision types in an entity system
 */
@Injectable()
export class CollisionTypesService extends BaseAttributeService<string> {
    constructor() {
        super();
    } 

    /**
     * Get the collision type for a specific attribute on a specific entity
     */
    getCollisionTypeForAttribute(key : AttributeKey, entity : Entity) : string {
        let collisionTypeGetter = this.getImplementation(key);
        if (collisionTypeGetter) {
            return collisionTypeGetter(entity);
        }
        return null;
    }

    /**
     * Get the collision type for a specific entity
     */
    getCollisionTypeForEntity(entity : Entity) : string {
        for (let key in entity) {
            let collisionType = this.getCollisionTypeForAttribute(key, entity);
            if (collisionType) {
                return collisionType;
            }
        }
        return null;
    }

    /**
     * Get all the unique collision types for an entity system
     */
    getUniqueCollisionTypesInEntitySystem(entitySystem : EntitySystem) : string[] {
        let collisionTypes = new Set<string>();
        entitySystem.forEach((entity : Entity, key : EntityKey)  => {
            let collisionType = this.getCollisionTypeForEntity(entity);
            if (collisionType) {
                collisionTypes.add(collisionType);
            }
        });
        return Array.from(collisionTypes.values());
    }
}
