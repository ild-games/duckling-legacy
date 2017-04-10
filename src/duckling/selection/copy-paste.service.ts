import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {Action, StoreService, newMergeKey} from '../state';
import {Vector, vectorRound} from '../math';
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

    copy(entityKey : EntityKey) {
        let entity = this._entitySystem.getEntity(entityKey);
        this._store.dispatch(_copyAction(entity));
    }

    paste(position : Vector) : EntityKey {
        let clipboardEntity = this.clipboard.value.copiedEntity;
        if (clipboardEntity) {
            return this._entitySystem.addNewEntity(this._position.setPosition(clipboardEntity, vectorRound(position)));
        } else {
            return null;
        }
    }
}

/**
 * State of the clipboard.
 */
export interface CopyPasteState {
    copiedEntity? : Entity
}

/**
 * Reducer used to update the clipboard state.
 */
export function copyPasteReducer(state : CopyPasteState = {}, action : Action) {
    if (action.type === ACTION_COPY_ENTITY) {
        return {
            copiedEntity : (action as CopyAction).copiedEntity
        }
    }
    return state;
}

const ACTION_COPY_ENTITY = "CopyPaste.Copy";
interface CopyAction extends Action {
    copiedEntity : Entity
}
function _copyAction(copiedEntity : Entity) {
    return {
        copiedEntity,
        type : ACTION_COPY_ENTITY
    }
}
