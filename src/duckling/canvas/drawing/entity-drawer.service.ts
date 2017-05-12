import {Component, Injectable} from '@angular/core';
import {Container, DisplayObject, Graphics} from 'pixi.js';
import {BehaviorSubject} from 'rxjs';

import {BaseAttributeService} from '../../entitysystem/base-attribute.service';
import {AssetService} from '../../project';
import {Vector} from '../../math/vector';
import {TaggedEntity, Entity, EntitySystem, Attribute, AttributeKey} from '../../entitysystem/entity';
import {EntitySystemService} from '../../entitysystem/entity-system.service';
import {EntityPositionService} from '../../entitysystem/services/entity-position.service';
import {drawMissingAsset} from '../../canvas/drawing/util';
import {EntityLayerService, HiddenAttributes, AttributeLayer, layerAttributeAction} from '../../entitysystem/services/entity-layer.service';
import {AvailableAttributeService} from '../../entitysystem/services/available-attribute.service';
import {StoreService} from '../../state/store.service';
import {immutableAssign} from '../../util/model';

import {RenderPriorityService} from './render-priority.service';
import {DrawnConstruct, setConstructPosition, displayObjectsForDrawnConstructs} from './drawn-construct';

export type AttributeDrawer<T> = (attribute : T, assetService? : any) => DrawnConstruct;

type EntityCache = {[key:string]:EntityCacheEntry};

interface EntityCacheEntry {
    entity : Entity,
    renderedEntity : DrawnConstruct []
}

@Injectable()
export class EntityDrawerService extends BaseAttributeService<AttributeDrawer<Attribute>> {
    hiddenAttributes : BehaviorSubject<HiddenAttributes>;
    invalidateDrawableCache : BehaviorSubject<boolean>;

    constructor(private _assets : AssetService,
                private _renderPriority : RenderPriorityService,
                private _entityPosition : EntityPositionService,
                private _entitySystem : EntitySystemService,
                private _layers : EntityLayerService,
                private _availabeAttributes : AvailableAttributeService,
                private _store : StoreService) {
        super();
        this.invalidateDrawableCache = new BehaviorSubject(false);

        _assets.assetLoaded.subscribe(() => this._clearCache());
        _assets.preloadImagesLoaded.subscribe(() => this._clearCache());
        _layers.hiddenLayers.subscribe(() => this._clearCache());
        _entitySystem.entitySystem.subscribe(() => this._clearCache());
        
        this.hiddenAttributes = new BehaviorSubject({});
        this.hiddenAttributes.subscribe(() => this._clearCache());
        this._store.state.subscribe(state => {
            if (state.layers.hiddenAttributes !== this.hiddenAttributes.value) {
                this.hiddenAttributes.next(state.layers.hiddenAttributes ? state.layers.hiddenAttributes : {});
            }
        });
    }

    drawEntitySystem(entitySystem : EntitySystem) : DrawnConstruct[] {
        let sortedEntities = this._renderPriority.sortEntities(entitySystem);
        return this._getEntitySystemDrawables(sortedEntities);
    }

    getAttributeDrawable(key : AttributeKey, entity : Entity) : DrawnConstruct {
        let drawer = this.getImplementation(key);
        if (drawer && drawer) {
            let drawnConstruct : DrawnConstruct;
            if (this._assets.areAssetsLoaded(entity, key)) {
                drawnConstruct = drawer(entity[key], this._assets);
            } else {
                drawnConstruct = drawMissingAsset(this._assets);
            }

            if (drawnConstruct) {
                setConstructPosition(
                    drawnConstruct,
                    this._entityPosition.getPosition(entity));
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

    private _getEntitySystemDrawables(entities : TaggedEntity[]) : DrawnConstruct[] {
        let drawnConstructs : DrawnConstruct[] = [];
        let newCache : EntityCache = {};
        for (let entity of entities) {
            for (let construct of this.getEntityDrawable(entity.entity)) {
                drawnConstructs.push(construct);
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

    toggleAttributeVisibility(attributeKey : string, mergeKey? : any) {
        let patchAttributes : HiddenAttributes = {};
        patchAttributes[attributeKey] = !this.hiddenAttributes.value[attributeKey];
        this._store.dispatch(layerAttributeAction(immutableAssign(this.hiddenAttributes.value, patchAttributes)), mergeKey);
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


        return (!this.hiddenAttributes.value[attributeKey]);
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


    private _clearCache() {
        this.invalidateDrawableCache.next(true);
    }
}