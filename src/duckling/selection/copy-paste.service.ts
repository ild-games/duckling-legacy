import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {Action, StoreService, newMergeKey} from '../state';
import {Vector} from '../math';
import {Entity, EntitySystemService, EntityPositionSetService, EntityKey} from '../entitysystem';
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
                private _setPosition : EntityPositionSetService) {
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
            let mergeKey = newMergeKey();
            let entityKey = this._entitySystem.addNewEntity(clipboardEntity, mergeKey);
            this._setPosition.setPosition(entityKey, position, mergeKey);
            return entityKey;
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
