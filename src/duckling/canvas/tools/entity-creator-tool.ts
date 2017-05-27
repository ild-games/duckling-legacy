import {Injectable} from '@angular/core';
import {Graphics, DisplayObject} from 'pixi.js';

import {
    Entity,
    AttributeDefaultService,
    EntitySystemService,
    EntityPositionService,
    EntityBoxService
} from '../../entitysystem';
import {Vector} from '../../math';
import {SelectionService} from '../../selection';
import {newMergeKey} from '../../state';
import {BaseTool, CanvasMouseEvent} from './base-tool';
import {drawRectangle} from '../drawing';
import {DrawnConstruct} from '../drawing/drawn-construct';

@Injectable()
export class EntityCreatorTool extends BaseTool {
    constructor(private _attributeDefaultService : AttributeDefaultService,
                private _entitySystemService : EntitySystemService,
                private _entityPositionService : EntityPositionService,
                private _entityBoxService : EntityBoxService,
                private _selection : SelectionService) {
        super();
    }

    drawTool(canvasZoom : number) : DrawnConstruct {
        let selectedEntityKey = this._selection.selection.value.selectedEntity;
        let selectedEntity = this._entitySystemService.getEntity(selectedEntityKey);
        if (!selectedEntity) {
            return new DrawnConstruct();
        }

        let box = this._entityBoxService.getEntityBox(selectedEntity);
        if (!box) {
            return new DrawnConstruct();
        }

        let drawnConstruct = new DrawnConstruct();
        drawnConstruct.layer = Number.POSITIVE_INFINITY;
        drawnConstruct.painter = (graphics : Graphics) => {
            graphics.lineStyle(1 / canvasZoom, 0xffcc00, 1);
            drawRectangle(box.position, box.dimension, graphics);
        };
        return drawnConstruct;
    }

    onStageDown(event : CanvasMouseEvent) {
        let mergeKey = newMergeKey();
        let entity = this._attributeDefaultService.createEntity();
        entity = this._entityPositionService.setPosition(entity, event.stageCoords);
        let key = this._entitySystemService.addNewEntity(entity, mergeKey);
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
