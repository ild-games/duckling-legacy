import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  Injectable
} from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { Attribute, Entity, EntityKey, AttributeKey } from "../entity";
import { BaseAttributeService } from "../base-attribute.service";
import { EntitySystemService } from "../entity-system.service";
import { Action } from "../../state/actions";
import { StoreService } from "../../state/store.service";
import { immutableAssign } from "../../util/model";
import { ACTION_OPEN_MAP } from "../../project/project";

export type LayerGetter = (attribute: Attribute) => string;
export type HiddenLayers = { [layerKey: string]: boolean };
export type HiddenAttributes = { [attributeKey: string]: boolean };
export type Layer = {
  layerName: string;
  isVisible: Boolean;
};
export type AttributeLayer = {
  attributeName: string;
  isVisible: Boolean;
};

@Injectable()
export class EntityLayerService extends BaseAttributeService<LayerGetter> {
  hiddenLayers: BehaviorSubject<LayerState>;

  constructor(
    private _entitySystemService: EntitySystemService,
    private _store: StoreService
  ) {
    super();

    this.hiddenLayers = new BehaviorSubject({
      hiddenLayers: {},
      hiddenAttributes: {}
    });
    this._store.state.subscribe(state => {
      if (state.hiddenLayers !== this.hiddenLayers.value) {
        this.hiddenLayers.next(state.hiddenLayers);
      }
    });
  }

  getLayers(): Layer[] {
    let layers: Layer[] = [];
    let layersAccountedFor = new Set<string>();
    let entitySystem = this._entitySystemService.entitySystem.value;

    entitySystem.forEach((entity: Entity) => {
      for (let attributeKey in entity) {
        let getLayerImpl = this.getImplementation(attributeKey);
        if (!getLayerImpl) {
          continue;
        }
        let layerKey = getLayerImpl(entity[attributeKey]);

        if (
          !layersAccountedFor.has(layerKey) &&
          layerKey !== undefined &&
          layerKey !== null
        ) {
          layers.push({
            layerName: layerKey,
            isVisible: !this.hiddenLayers.value.hiddenLayers[layerKey]
          });
          layersAccountedFor.add(layerKey);
        }
      }
    });

    return layers;
  }

  getAttributeLayer(entity: Entity, attributeKey: AttributeKey): string {
    let getLayerImpl = this.getImplementation(attributeKey);
    if (getLayerImpl) {
      return getLayerImpl(entity[attributeKey]);
    }

    return "";
  }

  toggleLayerVisibility(layerKey: string, mergeKey?: any) {
    let patchLayers: HiddenLayers = {};
    patchLayers[layerKey] = !this.hiddenLayers.value.hiddenLayers[layerKey];
    this._store.dispatch(
      _layerAction(
        immutableAssign(this.hiddenLayers.value.hiddenLayers, patchLayers)
      ),
      mergeKey
    );
  }

  toggleAttributeVisibility(attributeKey: string, mergeKey?: any) {
    let patchAttributes: HiddenAttributes = {};
    patchAttributes[attributeKey] = !this.hiddenLayers.value.hiddenAttributes[
      attributeKey
    ];
    this._store.dispatch(
      _layerAttributeAction(
        immutableAssign(
          this.hiddenLayers.value.hiddenAttributes,
          patchAttributes
        )
      ),
      mergeKey
    );
  }

  setLayerVisibility(layerKey: string, isHidden: boolean, mergeKey?: any) {
    let patchLayers: HiddenLayers = {};
    patchLayers[layerKey] = isHidden;
    this._store.dispatch(
      _layerAction(
        immutableAssign(this.hiddenLayers.value.hiddenLayers, patchLayers)
      ),
      mergeKey
    );
  }

  setAttributeVisibility(
    attributeKey: string,
    isHidden: boolean,
    mergeKey?: any
  ) {
    let patchAttributes: HiddenAttributes = {};
    patchAttributes[attributeKey] = isHidden;
    this._store.dispatch(
      _layerAttributeAction(
        immutableAssign(
          this.hiddenLayers.value.hiddenAttributes,
          patchAttributes
        )
      ),
      mergeKey
    );
  }

  isEntityOnAnActiveLayer(entity: Entity): boolean {
    for (let attributeKey in entity) {
      if (this.isAttributeOnAnActiveLayer(entity, attributeKey)) {
        return true;
      }
    }
    return false;
  }

  isAttributeOnAnActiveLayer(entity: Entity, attributeKey: string) {
    let getLayerImpl = this.getImplementation(attributeKey);
    if (!getLayerImpl) {
      return false;
    }

    let layerKey: string = getLayerImpl(entity[attributeKey]);
    return !this.hiddenLayers.value.hiddenLayers[layerKey];
  }

  isAttributeImplemented(attributeKey: string) {
    let getLayerImpl = this.getImplementation(attributeKey);
    return !!getLayerImpl;
  }
}

/**
 * State for the current layers
 */
export interface LayerState {
  hiddenLayers: HiddenLayers;
  hiddenAttributes: HiddenAttributes;
}

export function layerReducer(
  state: LayerState = { hiddenLayers: {}, hiddenAttributes: {} },
  action: LayerAction
): LayerState {
  if (action.type === ACTION_TOGGLE_LAYER_VISIBILITY) {
    return {
      ...state,
      hiddenLayers: action.hiddenLayers
    };
  } else if (action.type === ACTION_TOGGLE_ATTRIBUTE_VISIBILITY) {
    return {
      ...state,
      hiddenAttributes: action.hiddenAttributes
    };
  } else if (action.type === ACTION_OPEN_MAP) {
    return { hiddenLayers: {}, hiddenAttributes: {} };
  }
  return state;
}

const ACTION_TOGGLE_LAYER_VISIBILITY = "Layer.ToggleVisibility";
const ACTION_TOGGLE_ATTRIBUTE_VISIBILITY = "Layer.Attribute.ToggleVisibility";
interface LayerAction extends Action {
  hiddenLayers?: HiddenLayers;
  hiddenAttributes?: HiddenAttributes;
}

function _layerAction(hiddenLayers: HiddenLayers) {
  return {
    hiddenLayers,
    type: ACTION_TOGGLE_LAYER_VISIBILITY
  };
}

function _layerAttributeAction(hiddenAttributes: HiddenAttributes) {
  return {
    hiddenAttributes,
    type: ACTION_TOGGLE_ATTRIBUTE_VISIBILITY
  };
}
