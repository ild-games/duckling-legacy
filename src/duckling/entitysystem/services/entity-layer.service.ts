import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    Injectable
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {Attribute, Entity, EntityKey, AttributeKey} from '../entity';
import {BaseAttributeService} from '../base-attribute.service';
import {EntitySystemService} from '../entity-system.service';
import {Action} from '../../state/actions';
import {StoreService} from '../../state/store.service';
import {immutableAssign} from '../../util/model';
import {ACTION_OPEN_MAP} from '../../project/project';

export type LayerGetter = (attribute : Attribute) => string;
export type HiddenLayers = {[layerKey : string] : boolean};
export type HiddenAttributes = {[attributeKey : string] : boolean};
export type Layer = {
    layerName : string;
    isVisible : Boolean;
}
export type AttributeLayer = {
    attributeName : string;
    isVisible : Boolean;
}

@Injectable()
export class EntityLayerService extends BaseAttributeService<LayerGetter> {

    hiddenLayers : BehaviorSubject<HiddenLayers>;
    hiddenAttributes : BehaviorSubject<HiddenAttributes>;

    constructor(private _entitySystemService : EntitySystemService,
                private _store : StoreService) {
        super();

        this.hiddenLayers = new BehaviorSubject({});
        this.hiddenAttributes = new BehaviorSubject({});
        this._store.state.subscribe(state => {
            if (state.layers.hiddenLayers !== this.hiddenLayers.value) {
                this.hiddenLayers.next(state.layers.hiddenLayers ? state.layers.hiddenLayers : {});
            }

            if (state.layers.hiddenAttributes !== this.hiddenAttributes.value) {
                this.hiddenAttributes.next(state.layers.hiddenAttributes ? state.layers.hiddenAttributes : {});
            }
        });
    }

    getLayers() : Layer[] {
        let layers : Layer[] = [];
        let layersAccountedFor = new Set<string>();
        let entitySystem = this._entitySystemService.entitySystem.value;

        entitySystem.forEach((entity : Entity) => {
            for (let attributeKey in entity) {
                let getLayerImpl = this.getImplementation(attributeKey);
                if (!getLayerImpl) { continue; }
                let layerKey = getLayerImpl(entity[attributeKey]);
                
                if (!layersAccountedFor.has(layerKey) && layerKey !== undefined && layerKey !== null) {
                    layers.push({
                        layerName: layerKey,
                        isVisible: !this.hiddenLayers.value[layerKey]
                    });
                    layersAccountedFor.add(layerKey);
                }
            }
        });

        return layers;
    }

    getAttributeLayers(implementedDrawerAttributets : AttributeKey[]) : AttributeLayer[] {
        let attributeLayers : AttributeLayer[] = [];
        for (let attributeKey of implementedDrawerAttributets) {
            attributeLayers.push({
                attributeName: attributeKey,
                isVisible: this.isAttributeVisible(attributeKey)
            });
        }
        return attributeLayers;
    }

    toggleLayerVisibility(layerKey : string, mergeKey? : any) {
        let patchLayers : HiddenLayers = {};
        patchLayers[layerKey] = !this.hiddenLayers.value[layerKey];
        this._store.dispatch(_layerAction(immutableAssign(this.hiddenLayers.value, patchLayers)), mergeKey);
    }

    toggleAttributeVisibility(attributeKey : string, mergeKey? : any) {
        let patchAttributes : HiddenAttributes = {};
        patchAttributes[attributeKey] = !this.hiddenAttributes.value[attributeKey];
        this._store.dispatch(_layerAttributeAction(immutableAssign(this.hiddenAttributes.value, patchAttributes)), mergeKey);
    }

    getVisibleEntities(entities: Entity[]) : Entity[] {
        let visibleEntities : Entity[] = [];
        for (let entity of entities){
            if (this.isEntityVisible(entity)){
                visibleEntities.push(entity);
            }
        }
        return visibleEntities;
    }

    isEntityVisible(entity : Entity) : boolean {
        for (let attributeKey in entity) {
            if (this.isEntityAttributeVisible(entity, attributeKey)) {
                return true;
            }
        }
        return false;
    }

    isEntityAttributeVisible(entity: Entity, attributeKey: string) {
        if (!this.isAttributeVisible(attributeKey)) {
            return false;
        }

        let getLayerImpl = this.getImplementation(attributeKey);
        if (!getLayerImpl) { 
            return this.isAttributeVisible(attributeKey);
        }

        let layerKey : string  = getLayerImpl(entity[attributeKey]);
        return (!this.hiddenLayers.value[layerKey]);
    }

    isAttributeVisible(attributeKey : string) {
        return (!this.hiddenAttributes.value[attributeKey]);
    }
}

/**
 * State for the current layers
 */
interface LayerState {
    hiddenLayers?: HiddenLayers;
    hiddenAttributes?: HiddenAttributes;
}

export function layerReducer(state : LayerState = { hiddenLayers: {}, hiddenAttributes: {} }, action : LayerAction) {
    if (action.type === ACTION_TOGGLE_LAYER_VISIBILITY) {
        return {
            ...state,
            hiddenLayers: action.hiddenLayers,
        }
    } else if (action.type === ACTION_TOGGLE_ATTRIBUTE_VISIBILITY) {
        return {
            ...state,
            hiddenAttributes: action.hiddenAttributes,
        }
    } else if (action.type === ACTION_OPEN_MAP) {
        return { hiddenLayers: {} };
    }
    return state;
}

const ACTION_TOGGLE_LAYER_VISIBILITY = "Layer.ToggleVisibility";
const ACTION_TOGGLE_ATTRIBUTE_VISIBILITY = "Layer.Attribute.ToggleVisibility";
interface LayerAction extends Action {
    hiddenLayers?: HiddenLayers;
    hiddenAttributes? : HiddenAttributes;
}

function _layerAction(hiddenLayers: HiddenLayers) {
    return {
        hiddenLayers,
        type: ACTION_TOGGLE_LAYER_VISIBILITY
    }
}

function _layerAttributeAction(hiddenAttributes: HiddenAttributes) {
    return {
        hiddenAttributes,
        type: ACTION_TOGGLE_ATTRIBUTE_VISIBILITY
    }
}