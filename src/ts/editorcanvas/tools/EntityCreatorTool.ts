///<reference path="BaseTool.ts"/>
module editorcanvas.tools {

    import draw = entityframework.components.drawing;
    import comp = entityframework.components;

    /**
     * Tool used to create a new entity on the canvas. Defaults with
     * basic Position, Collision, and Drawable components.
     */
    export class EntityCreatorTool extends BaseTool {
        onLeftClick(position : math.Vector) {
            var localCoords = this.canvas.stage.globalToLocal(position.x, position.y);
            this.createBasicEntity(new math.Vector(localCoords.x, localCoords.y));
        }

        private createBasicEntity(mousePos : math.Vector) {
            var rectEntity = new entityframework.Entity();
            var physComp = new comp.PositionComponent();
            var drawComp = new draw.DrawableComponent();
            var collisionComp = new comp.CollisionComponent();
            rectEntity.addComponent("position", physComp);
            rectEntity.addComponent("drawable", drawComp);
            rectEntity.addComponent("collision", collisionComp);
            physComp.position.x = mousePos.x;
            physComp.position.y = mousePos.y;

            collisionComp.info.dimension.x = 15;
            collisionComp.info.dimension.y = 15;
            this.context.commandQueue.pushCommand(
                new entityframework.AddEntityCommand(this.entitySystem, rectEntity, this.context));
        }

        get key() : string {
            return "createEntity";
        }

        get label() : string {
            return "Create Entity";
        }
    }

}
