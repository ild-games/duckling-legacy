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
import {Action} from '../../state/actions';
import {StoreService} from '../../state/store.service';
import {immutableAssign} from '../../util/model';
import {ACTION_OPEN_MAP} from '../../project/project';

/**
 * Function type that is used to set a position.
 * @returns Returns the new value of the attribute.
 */
export type LayerGetter = (attribute : Attribute) => string;
export type HiddenLayers = {[layerKey : string] : boolean};

/**
 * The EntityLayerService is used to retrieve the layer of an entity.
 */
@Injectable()
export class EntityLayerService extends BaseAttributeService<LayerGetter> {

    hiddenLayers : BehaviorSubject<HiddenLayers>;

    constructor(private _entitySystemService : EntitySystemService,
                private _store : StoreService) {
        super();

        this.hiddenLayers = new BehaviorSubject({});
        this._store.state.subscribe(state => {
            this.hiddenLayers.next(state.layers.hiddenLayers ? state.layers.hiddenLayers : {});
        });
    }

    isEntityVisible(entity : Entity) : boolean {
        let layerKey : string = this.getLayer(entity);
        return !this.hiddenLayers.value[layerKey];
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
                    isVisible: !this.hiddenLayers.value[layerKey]
                });
                layersAccountedFor.add(layerKey);
            }
        });

        return layers;
    }

    toggleLayerVisibility(layerKey : string, mergeKey? : any) {
        let patchLayers : HiddenLayers = {};
        patchLayers[layerKey] = !this.hiddenLayers.value[layerKey];
        this._store.dispatch(_layerAction(immutableAssign(this.hiddenLayers.value, patchLayers)), mergeKey);
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
}

export type Layer = {
    layerName : string;
    isVisible : Boolean;
}


/**
 * State for the current layers
 */
interface LayerState {
    hiddenLayers?: HiddenLayers;
}

export function layerReducer(state : LayerState = {}, action : LayerAction) {
    if (action.type === ACTION_TOGGLE_LAYER_VISIBILITY) {
        return {
            hiddenLayers: action.hiddenLayers
        }
    } else if (action.type === ACTION_OPEN_MAP) {

        // clear layers if the current map is changing
        return {};
    }
    return state;
}

const ACTION_TOGGLE_LAYER_VISIBILITY = "Layer.ToggleVisibility";
interface LayerAction extends Action {
    hiddenLayers?: HiddenLayers;
}
function _layerAction(hiddenLayers: HiddenLayers) {
    return {
        hiddenLayers,
        type: ACTION_TOGGLE_LAYER_VISIBILITY
    }
}
