import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {Action, StoreService, newMergeKey} from '../state';
import {Vector, vectorRound, vectorSubtract, vectorAdd} from '../math';
import {Entity, EntitySystemService, EntityPositionService, EntityKey} from '../entitysystem';
import {SelectionService} from './selection.service';

/**
 * Service used to manage copy pasting of entities.
 */
@Injectable()
export class CopyPasteService {

    public clipboard : BehaviorSubject<CopyPasteState>;

    constructor(private _store : StoreService,
                private _entitySystem : EntitySystemService,
                private _selection : SelectionService,
                private _position : EntityPositionService) {
        this.clipboard = new BehaviorSubject({});
        this._store.state.subscribe(state => this.clipboard.next(state.clipboard));
    }

    copy(entities : Entity[]) {
        this._store.dispatch(_copyAction(entities));
    }

    paste(position : Vector) : EntityKey[] {
        let clipboardEntities = this.clipboard.value.copiedEntities;
        if (!clipboardEntities) {
            return null;
        }

        let pastedEntities: EntityKey[] = [];
        let lowestPoint = this.findLowestPoint(clipboardEntities);
        let mergeKey = newMergeKey();
        for (let entity of clipboardEntities) {
            let newEntity = this._position.setPosition(entity, vectorRound(vectorAdd(position, vectorSubtract(this._position.getPosition(entity), lowestPoint))));
            pastedEntities.push(this._entitySystem.addNewEntity(newEntity, mergeKey));
        }
        return pastedEntities;
    }

    findLowestPoint(entities : Entity[]) : Vector {
        let lowestPoint = { x: Number.MAX_VALUE, y: Number.MAX_VALUE };
        for (let entity of entities) {
            let position = this._position.getPosition(entity);
            if (position) {
                lowestPoint.x = Math.min(lowestPoint.x, position.x);
                lowestPoint.y = Math.min(lowestPoint.y, position.y);
            }
        }
        return lowestPoint;
    }
}

/**
 * State of the clipboard.
 */
export interface CopyPasteState {
    copiedEntities? : Entity[]
}

/**
 * Reducer used to update the clipboard state.
 */
export function copyPasteReducer(state : CopyPasteState = {}, action : Action) {
    if (action.type === ACTION_COPY_ENTITIES) {
        return {
            copiedEntities : (action as CopyAction).copiedEntities
        }
    }
    return state;
}

const ACTION_COPY_ENTITIES = "CopyPaste.Copy";
interface CopyAction extends Action {
    copiedEntities : Entity
}
function _copyAction(copiedEntities : Entity[]) {
    return {
        copiedEntities,
        type : ACTION_COPY_ENTITIES
    }
}
