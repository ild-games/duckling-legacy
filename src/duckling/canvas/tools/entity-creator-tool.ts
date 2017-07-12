import {Injectable} from '@angular/core';
import {Graphics, DisplayObject} from 'pixi.js';

import {
    Entity,
    EntityKey,
    AttributeDefaultService,
    EntitySystemService,
    EntityPositionService,
    EntityBoxService
} from '../../entitysystem';
import {Vector} from '../../math/vector';
import {Box2} from '../../math/box2';
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
        if (this._selection.selections.value.length === 0) {
            return new DrawnConstruct();
        }

        let selectedEntityKey = this._selection.selections.value[0].key;
        if (!selectedEntityKey) {
            return new DrawnConstruct();
        }

        let box = this._entityBoxService.getEntityBox(selectedEntityKey);
        if (!box) {
            return new DrawnConstruct();
        }

        let drawnConstruct = new EntityCreatorToolDrawnConstruct(canvasZoom, box);
        drawnConstruct.layer = Number.POSITIVE_INFINITY;
        return drawnConstruct;
    }

    onStageDown(event : CanvasMouseEvent) {
        let mergeKey = newMergeKey();
        let entity = this._attributeDefaultService.createEntity();
        entity = this._entityPositionService.setPosition(entity, event.stageCoords);
        let key = this._entitySystemService.addNewEntity(entity, mergeKey);
        this._selection.deselect(mergeKey);
        this._selection.select([key], mergeKey);
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

class EntityCreatorToolDrawnConstruct extends DrawnConstruct {
    constructor(private _canvasZoom : number,
                private _box : Box2) {
        super();
    }

    paint(graphics : Graphics) {
        graphics.lineStyle(1 / this._canvasZoom, 0xffcc00, 1);
        drawRectangle(this._box.position, this._box.dimension, graphics);
    }
}