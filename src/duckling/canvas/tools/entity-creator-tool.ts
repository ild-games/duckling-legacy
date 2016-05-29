import {Injectable} from 'angular2/core';

import {newMergeKey} from '../../state';
import {AttributeDefaultService, EntitySystemService, EntityPositionSetService} from '../../entitysystem';
import {Vector} from '../../math';
import {BaseTool} from './base-tool';

@Injectable()
export class EntityCreatorTool extends BaseTool {
    constructor(private _attributeDefaultService : AttributeDefaultService,
                private _entitySystemService : EntitySystemService,
                private _entityPositionSetService : EntityPositionSetService) {
        super();
    }

    onStageDown(position : Vector) {
        var mergeKey = newMergeKey();
        var entity = this._attributeDefaultService.createEntity();
        var key = this._entitySystemService.addNewEntity(entity, mergeKey);
        this._entityPositionSetService.setPosition(key, position, mergeKey);
    }

    get key() {
        return "EntityCreatorTool";
    }

    get label() {
        return "Create";
    }

    get icon() {
        return "pencil";
    }
}
