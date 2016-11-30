import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    Injectable
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {Attribute, Entity, EntityKey} from '../entity';
import {BaseAttributeService} from '../base-attribute.service';
import {EntitySystemService} from '../entity-system.service';

/**
 * Function type that is used to set a position.
 * @returns Returns the new value of the attribute.
 */
export type LayerGetter = (attribute : Attribute) => string;

/**
 * The EntityLayerService is used to retrieve the layer of an entity.
 */
@Injectable()
export class EntityLayerService extends BaseAttributeService<LayerGetter> {

    private _hiddenLayers : {[layerKey : string] : boolean} = {};
    layerChanged : BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private _entitySystemService : EntitySystemService) {
        super();
    }

    isEntityVisible(entity : Entity) : boolean {
        let layerKey : string = this.getLayer(entity);
        return (!this._hiddenLayers[layerKey]);
    }

    /**
     * Get the layer of the entity
     * @param entityKey The key of the entity to get the layer from
     */
     getLayer(entity: Entity) : string {
        for (let key in entity) {
            let getLayerImpl = this.getImplementation(key);
            if (getLayerImpl) {
                return getLayerImpl(entity[key]);
            }
        }
        return null;
    }

    getLayers() : Layer[] {
        let layers : Layer[] = [];
        let layersAccountedFor = new Set<string>();
        let entitySystem = this._entitySystemService.entitySystem.value;

        entitySystem.forEach((entity : Entity) => {
            let layerKey = this.getLayer(entity);
            if (!layersAccountedFor.has(layerKey) && layerKey !== undefined && layerKey !== null) {
                layers.push({
                    layerName: layerKey,
                    isVisible: !this._hiddenLayers[layerKey]
                });
                layersAccountedFor.add(layerKey);
            }
        });

        return layers;
    }

    getVisibleEntities(entities: Array<Entity>) : Array<Entity> {
        let visibleEntities : Array<Entity> = [];
        for (let entity of entities){
            if (this.isEntityVisible(entity)){
                visibleEntities.push(entity);
            }
        }
        return visibleEntities;
    }

    toggleLayerVisibility(layerKey : string) {
        this._hiddenLayers[layerKey] = !this._hiddenLayers[layerKey];
        this.layerChanged.next(true);
    }

}

export type Layer = {

    layerName : string;
    isVisible : Boolean;

}
