import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    Injectable
} from '@angular/core';

import {Attribute, Entity, EntityKey} from '../entity';
import {BaseAttributeService} from '../base-attribute-service';
import {EntitySystemService} from '../entity-system.service';

/**
 * Function type that is used to set a position.
 * @returns Returns the new value of the attribute.
 */
export type LayerGetter = (attribute : Attribute) => Number;

/**
 * The EntityLayerService is used to retrieve the layer of an entity.
 */
@Injectable()
export class EntityLayerService extends BaseAttributeService<LayerGetter> {

    private _hiddenLayers : {[layerKey : string] : boolean} = {};

    constructor(private _entitySystemService : EntitySystemService) {
        super();
    }


    /**
     * Get the layer of the entity
     * @param entityKey The key of the entity to get the layer from
     */
     getLayer(entity: Entity) {
        for (let key in entity) {
            let getLayer = this.getImplementation(key);
            if (getLayer) {
                return getLayer(entity[key]);
            }
        }
    }

    getLayers() : Layer[] {
        let layers : Layer[] = [];
        let layersAccountedFor = new Set<string>();
        let entitySystem = this._entitySystemService.entitySystem.value;

        entitySystem.forEach((entity : Entity) => {
            let layerKey = "" + this.getLayer(entity);
            if (layersAccountedFor.has(layerKey)) return;
            if (layerKey !== undefined && layerKey !== null) {
                layers.push({
                    layerName: layerKey,
                    isVisible: !this._hiddenLayers[layerKey]
                });
                layersAccountedFor.add(layerKey);
            }
        });

        return layers;
    }

    toggleLayerVisibility(layerKey : string) {
        this._hiddenLayers[layerKey] = !this._hiddenLayers[layerKey];
    }
}

export type Layer = {

    layerName : string;
    isVisible : Boolean;

}
