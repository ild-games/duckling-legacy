import {Injectable} from '@angular/core';

import {BaseAttributeService, Entity, AttributeKey, EntitySystem} from '../entitysystem';
import {Asset, AssetMap} from '../project';

export type AttributeRequiredAssets = (entity : Entity) => AssetMap;

@Injectable()
export class RequiredAssetService extends BaseAttributeService<AttributeRequiredAssets> {
    constructor() {
        super();
    }

    assetsForAttribute(key : AttributeKey, entity : Entity) : AssetMap {
        let implementation = this.getImplementation(key);
        if (implementation) {
            return implementation(entity);
        }
        return {};
    }

    assetsForEntity(entity : Entity) : AssetMap {
        let assets : AssetMap = {};
        for (let key in entity) {
            assets = Object.assign(assets, this.assetsForAttribute(key, entity));
        }
        return assets;
    }

    assetsForEntitySystem(entitySystem : EntitySystem) : AssetMap {
        let assets : AssetMap = {};
        entitySystem.forEach((entity) => {
            assets = Object.assign(assets, this.assetsForEntity(entity));
        });
        return assets;
    }
}
