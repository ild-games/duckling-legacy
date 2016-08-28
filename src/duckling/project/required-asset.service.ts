import {Injectable} from '@angular/core';

import {BaseAttributeService, Entity, AttributeKey, EntitySystem} from '../entitysystem';
import {Asset, AssetMap} from '../project';

export type AttributeRequiredAssets = (entity : Entity) => AssetMap;

/**
 * Service used to determine the external assets needed by an entity system, entity, or attribute
 * in order to show what it will be like in the actual game.
 */
@Injectable()
export class RequiredAssetService extends BaseAttributeService<AttributeRequiredAssets> {
    constructor() {
        super();
    }

    /**
     * Gets all the assets needed for a given attribute on an entity
     * @param  key    Unique key identifying which attribute we want the assets for
     * @param  entity Entity to get the assets for
     * @return A map of asset keys to Assets that are required for the given entity's attribute
     */
    assetsForAttribute(key : AttributeKey, entity : Entity) : AssetMap {
        let implementation = this.getImplementation(key);
        if (implementation) {
            return implementation(entity);
        }
        return {};
    }

    /**
     * Gets all the assets needed for all the attributes on a given entity.
     * @param  entity Entity to get the assets for
     * @return A map of asset keys to Assets that are required for the entity.
     */
    assetsForEntity(entity : Entity) : AssetMap {
        let assets : AssetMap = {};
        for (let key in entity) {
            assets = Object.assign(assets, this.assetsForAttribute(key, entity));
        }
        return assets;
    }

    /**
     * Gets all the assets needed for all the attributes on all the entities in
     * a given EntitySystem
     * @param  entitySystem EntitySystem to get the assets for
     * @return A map of asset keys to Assets that are required for the entity system.
     */
    assetsForEntitySystem(entitySystem : EntitySystem) : AssetMap {
        let assets : AssetMap = {};
        entitySystem.forEach((entity) => {
            assets = Object.assign(assets, this.assetsForEntity(entity));
        });
        return assets;
    }
}
