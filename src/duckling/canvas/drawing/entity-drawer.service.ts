import {Component, Injectable} from '@angular/core';
import {Container, DisplayObject, Graphics} from 'pixi.js';
import {BehaviorSubject} from 'rxjs';

import {BaseAttributeService} from '../../entitysystem/base-attribute.service';
import {AssetService} from '../../project/asset.service';
import {Vector} from '../../math/vector';
import {TaggedEntity, Entity, EntitySystem, Attribute, AttributeKey} from '../../entitysystem/entity';
import {EntitySystemService} from '../../entitysystem/entity-system.service';
import {EntityPositionService} from '../../entitysystem/services/entity-position.service';
import {drawMissingAsset} from '../../canvas/drawing/util';
import {EntityLayerService, HiddenAttributes, AttributeLayer} from '../../entitysystem/services/entity-layer.service';
import {AvailableAttributeService} from '../../entitysystem/services/available-attribute.service';
import {StoreService} from '../../state/store.service';
import {immutableAssign} from '../../util/model';

import {RenderPriorityService} from './render-priority.service';
import {DrawnConstruct} from './drawn-construct';

export type AttributeDrawer<T> = (attribute : T, assetService? : AssetService, position? : Vector) => DrawnConstruct;

export interface EntityCache {
    cache? : EntityCacheInternal;
}

type EntityCacheInternal = {[key:string]:EntityCacheEntry};

interface EntityCacheEntry {
    entity : Entity,
    renderedEntity : DrawnConstruct []
}

@Injectable()
export class EntityDrawerService extends BaseAttributeService<AttributeDrawer<Attribute>> {
    /**
     * Publish true if the cache is still valid.
     */
    redraw : BehaviorSubject<boolean>;

    constructor(private _assets : AssetService,
                private _renderPriority : RenderPriorityService,
                private _entityPosition : EntityPositionService,
                private _entitySystem : EntitySystemService,
                private _layers : EntityLayerService,
                private _availabeAttributes : AvailableAttributeService,
                private _store : StoreService) {
        super();
        this.redraw = new BehaviorSubject(false);

        _assets.assetLoaded.subscribe(() => this._redraw());
        _assets.preloadAssetsLoaded.subscribe(() => this._redraw());
        _layers.hiddenLayers.subscribe(() => this._redraw());
        _entitySystem.entitySystem.subscribe(() => this._redraw(true));
    }

    drawEntitySystem(entitySystem : EntitySystem, cache? : EntityCache) : DrawnConstruct[] {
        let drawnConstructs : DrawnConstruct[] = [];
        let newCache : EntityCacheInternal = {}
        let oldCache : EntityCacheInternal = (cache && cache.cache) ? cache.cache : {};

        entitySystem.forEach((entity, entityKey) => {
            if (oldCache[entityKey] && oldCache[entityKey].entity === entity) {
                for (let construct of oldCache[entityKey].renderedEntity) {
                    drawnConstructs.push(construct);
                }
                newCache[entityKey] = oldCache[entityKey];
            } else {
                let renderedEntity = this.getEntityDrawable(entity);
                for (let construct of renderedEntity) {
                    drawnConstructs.push(construct);
                }
                newCache[entityKey] = {entity, renderedEntity};
            }
        });

        if (cache) {
            cache.cache = newCache;
        }

        return drawnConstructs;
    }

    getAttributeDrawable(key : AttributeKey, entity : Entity) : DrawnConstruct {
        let drawer = this.getImplementation(key);
        if (drawer) {
            let drawnConstruct : DrawnConstruct;
            if (this._assets.areAssetsLoaded(entity, key)) {
                drawnConstruct = drawer(entity[key], this._assets, this._entityPosition.getPosition(entity));
            } else {
                drawnConstruct = drawMissingAsset(this._assets);
            }

            if (drawnConstruct) {
                if (this._layers.isAttributeImplemented(key)) {
                    let layerString = this._layers.getAttributeLayer(entity, key);

                    // TODO better way to translate this from string
                    drawnConstruct.layer = parseFloat(layerString);
                }
            }
            return drawnConstruct;
        }
        return null;
    }

    getEntityDrawable(entity : Entity) : DrawnConstruct[] {
        let drawnConstructs : DrawnConstruct[] = [];
        for (let key in entity) {
            if (!this.isAttributeVisible(key)) {
                continue;
            }
            if (this._layers.isAttributeImplemented(key) && !this._layers.isAttributeOnAnActiveLayer(entity, key)) {
                continue;
            }

            let drawableConstruct = this.getAttributeDrawable(key, entity);
            if (drawableConstruct) {
                drawnConstructs.push(drawableConstruct);
            }
        }
        return drawnConstructs;
    }

    getAttributeLayers() : AttributeLayer[] {
        let attributeLayers : AttributeLayer[] = [];
        for (let attributeKey of this._getImplementedAttributes()) {
            attributeLayers.push({
                attributeName: attributeKey,
                isVisible: this.isAttributeVisible(attributeKey)
            });
        }
        return attributeLayers;
    }

    isEntityVisible(entity : Entity) : boolean {
        for (let attributeKey in entity) {
            if (!this.isAttributeVisible(attributeKey, entity)) {
                continue;
            }
            return true;
        }
        return false;
    }

    /**
     * Determine if an attribute is visible.
     * @param attributeKey key of attribute to check visibility of
     * @param entity? Optional, if provided the entity's layer will also be considered for the attribute
     */
    isAttributeVisible(attributeKey : string, entity? : Entity) {
        if (!this._getImplementedAttributes().includes(attributeKey)) {
            return false;
        }
        if (entity && this._layers.isAttributeImplemented(attributeKey) && !this._layers.isAttributeOnAnActiveLayer(entity, attributeKey)) {
            return false;
        }


        return (!this._layers.hiddenLayers.value.hiddenAttributes[attributeKey]);
    }

    private _getImplementedAttributes() : AttributeKey[] {
        let implementedAttributes : AttributeKey[] = [];
        for (let attributeKey of this._availabeAttributes.availableAttributes()) {
            if (this.getImplementation(attributeKey)) {
                implementedAttributes.push(attributeKey);
            }
        }
        return implementedAttributes;
    }

    private _redraw(entityCacheValid : boolean = false) {
        this.redraw.next(entityCacheValid);
    }
}
