///<reference path="BaseTool.ts"/>
module editorcanvas.tools {

    import draw = entityframework.components.drawing;
    import comp = entityframework.components;

    class MoveEntityCommand implements framework.command.Command {
        private selectedEntity : entityframework.Entity;
        private startPosition : math.Vector;
        private _endPosition : math.Vector;

        constructor(selectedEntity : entityframework.Entity, startPosition : math.Vector, endPosition : math.Vector) {
            this.selectedEntity = selectedEntity;
            this.startPosition = startPosition;
            this._endPosition = endPosition;
        }

        execute() {
            this.selectedEntity.getComponent<comp.PositionComponent>("position").position = this._endPosition;
        }

        undo() {
            this.selectedEntity.getComponent<comp.PositionComponent>("position").position = this.startPosition;
        }

        set endPosition(endPosition : math.Vector) {
            this._endPosition = endPosition;
        }
    }

    /**
     * Tool used to move an entity around the canvas. It also selects the entity
     * being moved.
     */
    export class EntityDragTool extends BaseTool {
        private moveCommand : MoveEntityCommand;
        private displayObject : createjs.DisplayObject = null;
        private selectService : editorcanvas.services.EntitySelectService = null;

        onBind(context : framework.Context) {
            super.onBind(context);
            this.selectService = context.getSharedObject(services.EntitySelectService);
        }

        getDisplayObject() : createjs.DisplayObject {
            return this.displayObject;
        }

        onStageDown(mousePos : math.Vector, canvas : editorcanvas.CanvasVM) {
            var localCoords = canvas.stage.globalToLocal(mousePos.x, mousePos.y);
            mousePos.x = localCoords.x;
            mousePos.y = localCoords.y;
            this.moveCommand = null;

            var selectableEntityKey = this.selectService.findSelectableEntity(new math.Vector(localCoords.x, localCoords.y));
            if (selectableEntityKey) {
                this.selectService.selectEntity(selectableEntityKey);
                this.setupMoveCommand(
                    this.context.getSharedObject(entityframework.EntitySystem).getEntity(selectableEntityKey),
                    mousePos);
            }
        }

        private setupMoveCommand(entity : entityframework.Entity, mousePos : math.Vector) {
            var entityPositionComp = entity.getComponent<comp.PositionComponent>("position");
            this.moveCommand = new MoveEntityCommand(
                entity,
                entityPositionComp.position,
                mousePos);
            this.setupDisplayObject(mousePos);
            this.context.commandQueue.pushCommand(this.moveCommand);
        }

        private setupDisplayObject(mousePos : math.Vector) {
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

        onStageUp(mousePos : math.Vector, canvas : editorcanvas.CanvasVM) {
            this.moveCommand = null;
            this.displayObject = null;
            canvas.redrawCanvas();
        }

        onStageMove(mousePos : math.Vector, canvas : editorcanvas.CanvasVM) {
            if (this.moveCommand && this.context.commandQueue.peekUndo() === this.moveCommand) {
                var localCoords = canvas.stage.globalToLocal(mousePos.x, mousePos.y);
                this.displayObject.x = localCoords.x;
                this.displayObject.y = localCoords.y;
                this.moveCommand.endPosition = new math.Vector(localCoords.x, localCoords.y);
                this.moveCommand.execute();
            }
        }

        get key() : string {
            return "moveEntity";
        }

        get label() : string {
            return "Move Entity";
        }

        get allowedMouseButtons() : Array<Number> {
            return [ BaseTool.LEFT_MOUSE_BUTTON ];
        }
    }
}
