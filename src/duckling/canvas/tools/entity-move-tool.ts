import {Injectable} from 'angular2/core';

import {
    EntitySelectionService,
    EntitySystemService,
    EntityPositionSetService,
    EntityKey
} from '../../entitysystem';
import {Vector} from '../../math';
import {BaseTool} from './base-tool';

@Injectable()
export class EntityMoveTool extends BaseTool {
    private _selection : EntityKey;

    constructor(private _entitySelectionService: EntitySelectionService,
                private _entitySystemService : EntitySystemService,
                private _entityPositionSetService : EntityPositionSetService) {
        super();
    }

    onStageDown(position : Vector) {
        this._selection = this._entitySelectionService.getEntityKey(position);
    }

    onStageMove(position : Vector) {
        if (this._selection) {
            this._entityPositionSetService.setPosition(this._selection, position);
        }
    }

    onStageUp() {
        this._cancel();
    }

    onLeaveStage() {
        this._cancel();
    }

    private _cancel() {
        this._selection = null;
    }
}
