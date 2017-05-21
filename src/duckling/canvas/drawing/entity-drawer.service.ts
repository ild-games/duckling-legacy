import {Component, Injectable} from '@angular/core';
import {Container, DisplayObject} from 'pixi.js';
import {BehaviorSubject} from 'rxjs';

import {BaseAttributeService} from '../../entitysystem/base-attribute.service';
import {AssetService} from '../../project';
import {Entity, EntitySystem, Attribute, AttributeKey, EntitySystemService} from '../../entitysystem';
import {EntityPositionService} from '../../entitysystem/services/entity-position.service';
import {drawMissingAsset} from '../../canvas/drawing/util';
import {EntityLayerService, HiddenAttributes, AttributeLayer, layerAttributeAction} from '../../entitysystem/services/entity-layer.service';
import {AvailableAttributeService} from '../../entitysystem/services/available-attribute.service';
import {StoreService} from '../../state/store.service';
import {immutableAssign} from '../../util/model';

import {RenderPriorityService} from './render-priority.service';
import {DrawnConstruct, setConstructPosition} from './drawn-construct';

/**
 * Function type used to draw attributes.
 */
export type AttributeDrawer<T> = (attribute : T, assetService? : any) => DrawnConstruct;

type EntityCache = {[key:string]:EntityCacheEntry};

interface EntityCacheEntry {
    entity : Entity,
    renderedEntity : DrawnConstruct []
}

/**
 * The AttributeComponentService is used to find and instantiate a component class
 * for an attribute.
 */
@Injectable()
export class EntityDrawerService extends BaseAttributeService<AttributeDrawer<Attribute>> {
    private _cache : EntityCache = {};
    hiddenAttributes : BehaviorSubject<HiddenAttributes>;

    constructor(private _assets : AssetService,
                private _renderPriority : RenderPriorityService,
                private _entityPosition : EntityPositionService,
                private _entitySystem : EntitySystemService,
                private _layers : EntityLayerService,
                private _availabeAttributes : AvailableAttributeService,
                private _store : StoreService) {
        super();
        _assets.assetLoaded.subscribe(() => this._clearCache());
        _assets.preloadImagesLoaded.subscribe(() => this._clearCache());
        _layers.hiddenLayers.subscribe(() => this._clearCache());
        
        this.hiddenAttributes = new BehaviorSubject({});
        this.hiddenAttributes.subscribe(() => this._clearCache());
        this._store.state.subscribe(state => {
            if (state.layers.hiddenAttributes !== this.hiddenAttributes.value) {
                this.hiddenAttributes.next(state.layers.hiddenAttributes ? state.layers.hiddenAttributes : {});
            }
        });
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


    /**
     * Get a DisplayObject for the entity.
     * @param entity Entity that needs to be drawn.
     * @return A DisplayObject for the entity.
     */
    drawEntity(entity : Entity) : DrawnConstruct[] {
        let drawnConstructs : DrawnConstruct[] = [];
        for (let key in entity) {
            if (!this.isAttributeVisible(key)) {
                continue;
            }
            if (this._layers.isAttributeImplemented(key) && !this._layers.isAttributeOnActiveLayer(entity, key)) {
                continue;
            }

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
            let newCache : EntityCache = {};
            this._renderPriority.sortEntities(entitySystem).forEach(entity => {
                let entry = this._cache[entity.key];
                if (!entry || entry.entity !== entity.entity) {
                    entry = {
                        entity : entity.entity,
                        renderedEntity : this.drawEntity(entity.entity)
                    }
                }
                for (let construct of entry.renderedEntity) {
                    drawnConstructs.push(construct);
                }
                newCache[entity.key] = entry;
            });
            this._cache = newCache;
            return drawnConstructs;
        }
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
            if (!this.isAttributeVisible(attributeKey)) {
                continue;
            }
            if (this._layers.isAttributeImplemented(attributeKey) && !this._layers.isAttributeOnActiveLayer(entity, attributeKey)) {
                continue;
            }

            return true;
        }
        return false;
    }

    isAttributeVisible(attributeKey : string) {
        if (!this._getImplementedAttributes().includes(attributeKey)) {
            return false;
        }

        return (!this.hiddenAttributes.value[attributeKey]);
    }
    
    private _getImplementedAttributes() : AttributeKey[] {
        let implementedAttributes : AttributeKey[] = [];
        for (let attributeKey of this._availabeAttributes.availableAttributes()) {
            let implementation = this.getImplementation(attributeKey);
            if (this.getImplementation(attributeKey)) {
                implementedAttributes.push(attributeKey);
            }
        }
        return implementedAttributes;
    }


    private _clearCache() {
        this._cache = {};
    }
}