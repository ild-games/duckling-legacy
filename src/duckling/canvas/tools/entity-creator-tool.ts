import {Injectable} from '@angular/core';
import {Graphics, DisplayObject} from 'pixi.js';

import {
    Entity,
    AttributeDefaultService,
    EntitySystemService,
    EntityPositionSetService,
    EntityBoxService
} from '../../entitysystem';
import {Vector} from '../../math';
import {SelectionService} from '../../selection';
import {newMergeKey} from '../../state';
import {BaseTool, CanvasMouseEvent} from './base-tool';
import {drawRectangle} from '../drawing';

@Injectable()
export class EntityCreatorTool extends BaseTool {
    constructor(private _attributeDefaultService : AttributeDefaultService,
                private _entitySystemService : EntitySystemService,
                private _entityPositionSetService : EntityPositionSetService,
                private _entityBoxService : EntityBoxService,
                private _selection : SelectionService) {
        super();
    }

    getDisplayObject(canvasZoom : number) : DisplayObject {
        return this._buildSelectionBox(canvasZoom);
    }

    onStageDown(event : CanvasMouseEvent) {
        let mergeKey = newMergeKey();
        let entity = this._attributeDefaultService.createEntity();
        let key = this._entitySystemService.addNewEntity(entity, mergeKey);
        this._entityPositionSetService.setPosition(key, event.stageCoords, mergeKey);
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

    private _buildSelectionBox(canvasZoom : number) : DisplayObject {
        let graphics : Graphics = null;
        let selectedEntityKey = this._selection.selection.value.selectedEntity;
        let selectedEntity = this._entitySystemService.getEntity(selectedEntityKey);
        if (selectedEntity) {
            graphics = this._buildSelectionBoxAroundEntity(selectedEntity, canvasZoom);
        }
        return graphics;
    }

    private _buildSelectionBoxAroundEntity(entity : Entity, canvasZoom : number) : Graphics {
        let graphics : Graphics = null;
        let box = this._entityBoxService.getEntityBox(entity);
        if (box) {
            graphics = new Graphics();
            graphics.lineStyle(1 / canvasZoom, 0xffcc00, 1);
            drawRectangle(box.position, box.dimension, graphics);
        }
        return graphics;
    }

}
