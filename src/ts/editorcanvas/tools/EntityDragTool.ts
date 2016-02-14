import {Entity} from '../../entitysystem/core/Entity';
import {EntitySystem} from '../../entitysystem/core/EntitySystem';
import {PositionComponent} from '../../entitysystem/components/PositionComponent';
import Command from '../../framework/command/Command';
import Context from '../../framework/context/Context';
import Vector from '../../math/Vector';
import EntitySelectService from '../services/EntitySelectService';
import CanvasVM from '../CanvasVM';
import BaseTool from './BaseTool';

class MoveEntityCommand implements Command {
    private selectedEntity : Entity;
    private startPosition : Vector;
    private _endPosition : Vector;

    constructor(selectedEntity : Entity, startPosition : Vector, endPosition : Vector) {
        this.selectedEntity = selectedEntity;
        this.startPosition = startPosition;
        this._endPosition = endPosition;
    }

    execute() {
        this.selectedEntity.getComponent<PositionComponent>("position").position = this._endPosition;
    }

    undo() {
        this.selectedEntity.getComponent<PositionComponent>("position").position = this.startPosition;
    }

    set endPosition(endPosition : Vector) {
        this._endPosition = endPosition;
    }
}

/**
 * Tool used to move an entity around the canvas. It also selects the entity
 * being moved.
 */
export default class EntityDragTool extends BaseTool {
    private moveCommand : MoveEntityCommand;
    private displayObject : createjs.DisplayObject = null;
    private selectService : EntitySelectService = null;

    onBind(context : Context) {
        super.onBind(context);
        this.selectService = context.getSharedObject(EntitySelectService);
    }

    getDisplayObject() : createjs.DisplayObject {
        return this.displayObject;
    }

    onStageDown(mousePos : Vector, canvas : CanvasVM) {
        var localCoords = canvas.stage.globalToLocal(mousePos.x, mousePos.y);
        mousePos.x = localCoords.x;
        mousePos.y = localCoords.y;
        this.moveCommand = null;

        var selectableEntityKey = this.selectService.findSelectableEntity(new Vector(localCoords.x, localCoords.y));
        if (selectableEntityKey) {
            this.selectService.selectEntity(selectableEntityKey);
            this.setupMoveCommand(
                this.context.getSharedObject(EntitySystem).getEntity(selectableEntityKey),
                mousePos);
        }
    }

    private setupMoveCommand(entity : Entity, mousePos : Vector) {
        var entityPositionComp = entity.getComponent<PositionComponent>("position");
        this.moveCommand = new MoveEntityCommand(
            entity,
            entityPositionComp.position,
            mousePos);
        this.setupDisplayObject(mousePos);
        this.context.commandQueue.pushCommand(this.moveCommand);
    }

    private setupDisplayObject(mousePos : Vector) {
        this.displayObject = new createjs.Shape();
        (<createjs.Shape>this.displayObject).graphics.beginStroke("Red")
            .moveTo(-5, -5)
            .lineTo(5, 5)
            .moveTo(5, -5)
            .lineTo(-5, 5)
            .endStroke();
        this.displayObject.x = mousePos.x;
        this.displayObject.y = mousePos.y;
    }

    onStageUp(mousePos : Vector, canvas : CanvasVM) {
        this.moveCommand = null;
        this.displayObject = null;
        canvas.redrawCanvas();
    }

    onStageMove(mousePos : Vector, canvas : CanvasVM) {
        if (this.moveCommand && this.context.commandQueue.peekUndo() === this.moveCommand) {
            var localCoords = canvas.stage.globalToLocal(mousePos.x, mousePos.y);
            this.displayObject.x = localCoords.x;
            this.displayObject.y = localCoords.y;
            this.moveCommand.endPosition = new Vector(localCoords.x, localCoords.y);
            this.moveCommand.execute();
        }
    }

    get key() : string {
        return "moveEntity";
    }

    get label() : string {
        return "Move Entity";
    }
}
