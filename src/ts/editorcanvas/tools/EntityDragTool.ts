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

        getDisplayObject() : createjs.DisplayObject {
            return this.displayObject;
        }

        onStageDown(mousePos : math.Vector) {
            var localCoords = this.canvas.getStage().globalToLocal(mousePos.x, mousePos.y);
            mousePos.x = localCoords.x;
            mousePos.y = localCoords.y;
            this.moveCommand = null;
            this.entitySystem.forEach((entity : entityframework.Entity, key : string) => {
                var positionComp = entity.getComponent<comp.PositionComponent>("position");
                var drawable = entity.getComponent<draw.DrawableComponent>("drawable");
                if (positionComp && drawable) {
                    var position = positionComp.position;
                    drawable.topDrawable.forEach((obj) => {
                        if (obj && (<draw.ShapeDrawable>obj).shape.contains(mousePos, position)) {
                            this.moveCommand = new MoveEntityCommand(entity, position, mousePos);
                            var selectedEntity = this.context.getSharedObjectByKey("selectedEntity");
                            selectedEntity.entityKey = key;
                            this.context.setSharedObjectByKey("selectedEntity", selectedEntity);
                            return;
                        }
                    });
                }
            });
            if (this.moveCommand) {
                this.setupDisplayObject(mousePos);
                this.context.commandQueue.pushCommand(this.moveCommand);
            }
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

        onStageUp(mousePos : math.Vector) {
            this.moveCommand = null;
            this.displayObject = null;
            this.canvas.redrawCanvas();
        }

        onStageMove(mousePos : math.Vector) {
            if (this.moveCommand && this.context.commandQueue.peekUndo() === this.moveCommand) {
                var localCoords = this.canvas.getStage().globalToLocal(mousePos.x, mousePos.y);
                this.displayObject.x = localCoords.x;
                this.displayObject.y = localCoords.y;
                this.moveCommand.endPosition = new math.Vector(localCoords.x, localCoords.y);
                this.moveCommand.execute();
            }
        }

    }

}
