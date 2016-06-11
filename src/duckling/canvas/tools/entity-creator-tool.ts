import {Injectable} from 'angular2/core';

import {AttributeDefaultService, EntitySystemService, EntityPositionSetService} from '../../entitysystem';
import {Vector} from '../../math';
import {SelectionService} from '../../selection';
import {newMergeKey} from '../../state';
import {BaseTool} from './base-tool';

@Injectable()
export class EntityCreatorTool extends BaseTool {
    constructor(private _attributeDefaultService : AttributeDefaultService,
                private _entitySystemService : EntitySystemService,
                private _entityPositionSetService : EntityPositionSetService,
                private _selection : SelectionService) {
        super();
    }

    onStageDown(canvasCoords : Vector, stageCoords : Vector) {
        var mergeKey = newMergeKey();
        var entity = this._attributeDefaultService.createEntity();
        var key = this._entitySystemService.addNewEntity(entity, mergeKey);
        this._entityPositionSetService.setPosition(key, stageCoords, mergeKey);
        this._selection.select(key, mergeKey);
    }

    get key() {
        return "EntityCreatorTool";
    }

    get label() {
        return "Create Entity";
    }

    get icon() {
        return "pencil";
    }
}
