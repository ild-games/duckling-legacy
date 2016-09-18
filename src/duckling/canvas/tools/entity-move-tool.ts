import {Injectable} from '@angular/core';
import {Graphics, DisplayObject} from 'pixi.js';

import {
    EntitySelectionService,
    EntitySystemService,
    EntityPositionSetService,
    EntityKey,
    Entity,
    EntityBoxService
} from '../../entitysystem';
import {Vector} from '../../math';
import {newMergeKey} from '../../state';
import {SelectionService} from '../../selection';
import {getPosition} from '../../game/position/position-attribute';
import {drawRectangle} from '../drawing';


import {BaseTool, CanvasMouseEvent} from './base-tool';

@Injectable()
export class EntityMoveTool extends BaseTool {
    private _selection : EntityKey;
    private _mergeKey : any;
    private _selectOffsetCoords : Vector = {x: 0, y: 0};

    constructor(private _entitySelectionService: EntitySelectionService,
                private _entitySystemService : EntitySystemService,
                private _entityPositionSetService : EntityPositionSetService,
                private _selectionService : SelectionService,
                private _entityBoxService : EntityBoxService) {
        super();
    }

    getDisplayObject(canvasZoom : number) : DisplayObject {
        return this._buildSelectionBox(canvasZoom);
    }

    onStageDown(event : CanvasMouseEvent) {
        this._selection = this._entitySelectionService.getEntityKey(event.stageCoords);
        this._selectOffsetCoords = {x: 0, y: 0};
        if (this._selection) {
            let positionAttribute = getPosition(this._entitySystemService.getEntity(this._selection));
            this._selectOffsetCoords.x = positionAttribute.position.x - event.stageCoords.x;
            this._selectOffsetCoords.y = positionAttribute.position.y - event.stageCoords.y;
        }
        this._mergeKey = newMergeKey();
        this._selectionService.select(this._selection, this._mergeKey);
    }

    onStageMove(event : CanvasMouseEvent) {
        if (this._selection) {
            let nextCoords : Vector = event.stageCoords;
            nextCoords.x += this._selectOffsetCoords.x;
            nextCoords.y += this._selectOffsetCoords.y;
            this._entityPositionSetService.setPosition(this._selection, nextCoords, this._mergeKey);
        }
    }

    onStageUp(event : CanvasMouseEvent) {
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
        return "arrows";
    }

    private _cancel() {
        this._selection = null;
    }

    private _buildSelectionBox(canvasZoom : number) : DisplayObject {
        let graphics : Graphics = null;
        let entity = this._entitySystemService.getEntity(this._selection);
        if (entity){
            graphics = this._buildSelectionBoxAroundEntity(entity, canvasZoom);
        }
        return graphics;
    }

    private _buildSelectionBoxAroundEntity(entity : Entity, canvasZoom : number) : Graphics {
        let graphics : Graphics = null;
        let box = this._entityBoxService.getEntityBox(entity);
        if (box){
            graphics = new Graphics();
            graphics.lineStyle(1 / canvasZoom, 0x3355cc, 1);
            drawRectangle(box.position, box.dimension, graphics);
        }
        return graphics;
    }
}
