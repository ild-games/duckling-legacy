import {Injectable} from 'angular2/core';

import {
    EntitySelectionService,
    EntitySystemService,
    EntityPositionSetService,
    EntityKey
} from '../../entitysystem';
import {Vector} from '../../math';
import {newMergeKey} from '../../state';
import {SelectionService} from '../../selection';
import {BaseTool} from './base-tool';

@Injectable()
export class EntityMoveTool extends BaseTool {
    private _selection : EntityKey;
    private _mergeKey : any;

    constructor(private _entitySelectionService: EntitySelectionService,
                private _entitySystemService : EntitySystemService,
                private _entityPositionSetService : EntityPositionSetService,
                private _selectionService : SelectionService) {
        super();
    }

    onStageDown(canvasCoords : Vector, stageCoords : Vector) {
        this._selection = this._entitySelectionService.getEntityKey(stageCoords);
        this._mergeKey = newMergeKey();
        this._selectionService.select(this._selection, this._mergeKey);
    }

    onStageMove(canvasCoords : Vector, stageCoords : Vector) {
        if (this._selection) {
            this._entityPositionSetService.setPosition(this._selection, stageCoords, this._mergeKey);
        }
    }

    onStageUp(canvasCoords : Vector, stageCoords : Vector) {
        this._cancel();
    }

    onLeaveStage() {
        this._cancel();
    }

    get key() {
        return "EntityMoveTool";
    }

    get label() {
        return "Move Entity";
    }

    get icon() {
        return "move";
    }

    private _cancel() {
        this._selection = null;
    }
}
