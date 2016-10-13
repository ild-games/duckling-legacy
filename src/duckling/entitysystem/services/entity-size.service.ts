import {Injectable} from '@angular/core';

import {Vector} from '../../math/vector';
import {immutableAssign} from '../../util/model';
import {AssetService} from '../../project/asset.service';

import {BaseAttributeService} from '../base-attribute.service';
import {EntitySystemService} from '../entity-system.service';
import {Attribute, Entity, EntityKey} from '../entity';

import {EntityPositionService} from './entity-position.service';

export type SizeAttributeMap = {[attributeKey : string] : Vector};
export type SizeGetter = (entity : Entity) => Vector;
export type SizeSetter = (entity : Entity, newSize : Vector) => Attribute;
export type SizeServiceOperations = {
    get: SizeGetter,
    set: SizeSetter
};

@Injectable()
export class EntitySizeService extends BaseAttributeService<SizeServiceOperations> {
    constructor(private _entitySystemService : EntitySystemService,
                private _positionService : EntityPositionService,
                private _assetService : AssetService) {
        super();
    }

    setSize(entityKey : EntityKey, sizeAttributeMap : SizeAttributeMap, mergeKey? : any) {
        let entity = this._entitySystemService.getEntity(entityKey);
        let patch : Entity = {};

        for (let key in entity) {
            let setSize = this.getImplementation(key);
            if (setSize && setSize.set && sizeAttributeMap[key]) {
                patch[key] = setSize.set(entity, sizeAttributeMap[key], this._assetService);
            }
        }

        this._entitySystemService.updateEntity(entityKey, immutableAssign(entity, patch), mergeKey);
    }

    getSize(entityKey : EntityKey, mergeKey? : any) : SizeAttributeMap {
        let entity = this._entitySystemService.getEntity(entityKey);
        let sizeAttributeMap : SizeAttributeMap = {};

        for (let key in entity) {
            let getSize = this.getImplementation(key);
            if (getSize && getSize.get) {
                sizeAttributeMap[key] = getSize.get(entity, this._assetService);
            }
        }

        return sizeAttributeMap;
    }
}
