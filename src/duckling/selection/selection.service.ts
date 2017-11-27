import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { normalizeBox, boxContainsPoint, boxContainsBox } from '../math/box2';
import { Vector } from '../math/vector';

import { Action, StoreService } from '../state';
import { ACTION_OPEN_MAP } from '../project/project';
import { EntityKey, Entity } from '../entitysystem/entity';
import { EntitySystemService } from '../entitysystem/entity-system.service';
import { EntityLayerService } from '../entitysystem/services/entity-layer.service';
import { EntityDrawerService } from '../canvas/drawing/entity-drawer.service';
import { EntityBoxService } from '../entitysystem/services/entity-box.service';
import { RenderPriorityService } from '../canvas/drawing/render-priority.service';

/**
 * Interface describing the currently selected entity. Will be an empty object
 * if there is no selection.
 */
export interface Selection {
    key?: EntityKey,
    entity?: Entity
}

/**
 * Service used for managing the selection in the application.
 */
@Injectable()
export class SelectionService {

    public selections: BehaviorSubject<Selection[]>;

    constructor(private _store: StoreService,
        private _entitySystem: EntitySystemService,
        private _drawerService: EntityDrawerService,
        private _layerService: EntityLayerService,
        private _entityBoxService: EntityBoxService,
        private _renderPriority: RenderPriorityService) {
        this.selections = new BehaviorSubject([]);
        this._store.state.subscribe(state => {
            this.selections.next(this._getSelections(state.selections.selectedEntities));
        });
    }

    /**
     * Select the entity.
     * @param  entityKeys The keys of entities to select
     * @param  mergeKey   Optional mergeKey, describes which commands the action should be merged with.
     */
    select(entityKeys: EntityKey[] = [], mergeKey?: any) {
        this._store.dispatch(_selectionAction(entityKeys), mergeKey);
    }

    /**
     * Clear the current selection.
     * @param  mergeKey  Optional mergeKey, describes which commands the action should be merged with.
     */
    deselect(mergeKey?: any) {
        this.select([], mergeKey);
    }

    getEntityKeyAtPosition(position: Vector): EntityKey {
        let entities = Array.from(this._renderPriority.sortEntities(this._entitySystem.entitySystem.getValue()));
        entities.reverse();
        let taggedEntity = entities
            .filter(entity => this._drawerService.isEntityVisible(entity.entity))
            .find(entity => this._entityContainsPoint(entity.key, position));

        if (taggedEntity) {
            return taggedEntity.key;
        } else {
            return null;
        }
    }

    getEntityKeysInSelection(selectionPosition: Vector, selectionDimension: Vector): EntityKey[] {
        let entities = Array.from(this._renderPriority.sortEntities(this._entitySystem.entitySystem.getValue()));
        entities.reverse();
        let taggedEntities = entities
            .filter(entity => this._drawerService.isEntityVisible(entity.entity))
            .filter(entity => this._entityIsInsideSelection(entity.key, selectionPosition, selectionDimension));

        if (taggedEntities) {
            return taggedEntities.map(entity => entity.key);
        } else {
            return null;
        }
    }

    isSelected(entityKey: EntityKey) {
        return this.selections.value.find(selection => selection.key === entityKey) !== undefined;
    }

    private _entityContainsPoint(entityKey: EntityKey, position: Vector) {
        return boxContainsPoint(this._entityBoxService.getEntityBox(entityKey), position);
    }

    private _entityIsInsideSelection(entityKey: EntityKey, selectionPosition: Vector, selectionDimension: Vector) {
        return boxContainsBox(
            normalizeBox({
                position: selectionPosition,
                dimension: selectionDimension,
                rotation: 0
            }),
            this._entityBoxService.getEntityBox(entityKey));
    }

    private _getSelections(selectedEntityKeys: string[]): Selection[] {
        // NOTE: This used to filter the selected entities by their visibility. This
        //       seems to be incorrect behavior, but if you're ever back here thinking
        //       that's what should be happening then please test that the entity editor
        //       is still visible after selecting an entity.
        selectedEntityKeys = selectedEntityKeys || [];

        let selections: Selection[] = [];
        for (let key of selectedEntityKeys) {
            let entity = this._entitySystem.getEntity(key);
            selections.push({ key, entity });
        }
        return selections;
    }

}

/**
 * State of the currently selected entity.
 */
export interface SelectionState {
    selectedEntities?: EntityKey[];
}

/**
 * Reducer for the SelectionState.
 */
export function selectionReducer(state: SelectionState = {}, action: SelectionAction) {
    if (action.type === ACTION_SELECT_ENTITY) {
        if (!state.selectedEntities) {
            return { selectedEntities: action.selectedEntities || [] };
        }
        if (!action.selectedEntities || action.selectedEntities.length === 0) {
            return { selectedEntities: [] };
        }
        return {
            selectedEntities: state.selectedEntities.concat(
                action.selectedEntities.filter(selectedKey => !state.selectedEntities.includes(selectedKey)))
        };
    } else if (action.type === ACTION_OPEN_MAP) {

        //Clear selection if the current map is changing.
        return {
            selectedEntities: []
        };
    }
    return state;
}

const ACTION_SELECT_ENTITY = "Selection.SelectEntity";
interface SelectionAction extends Action {
    selectedEntities?: EntityKey[];
}
function _selectionAction(selectedEntities: EntityKey[]): SelectionAction {
    return {
        selectedEntities,
        type: ACTION_SELECT_ENTITY
    }
}
