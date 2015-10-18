///<reference path="BaseTool.ts"/>
module editorcanvas.tools {

    import draw = entityframework.components.drawing;
    import comp = entityframework.components;

    class AddEntityCommand implements framework.command.Command {
        private es : entityframework.EntitySystem;
        private entity : entityframework.Entity;
        private entityId : string;

        constructor(es : entityframework.EntitySystem, entity : entityframework.Entity) {
            this.es = es;
            this.entity = entity;
            this.entityId = this.es.nextKey();
        }

        execute() {
            this.es.addEntity(this.entityId, this.entity);
        }

        undo() {
            this.es.removeEntity(this.entityId);
        }
    }

    /**
     * Tool used to create a new entity on the canvas. Defaults with
     * basic Position, Collision, and Drawable components.
     */
    export class EntityCreatorTool extends BaseTool {
        onLeftClick(position : math.Vector) {
            this.createBasicEntity(position);
        }

        private createBasicEntity(mousePos : math.Vector) {
            var rectEntity = new entityframework.Entity();
            var physComp = new comp.PhysicsComponent();
            var drawComp = new draw.DrawableComponent();
            var collisionComp = new comp.CollisionComponent();
            rectEntity.addComponent("physics", physComp);
            rectEntity.addComponent("drawable", drawComp);
            rectEntity.addComponent("collision", collisionComp);
            physComp.info.position.x = mousePos.x;
            physComp.info.position.y = mousePos.y;

            drawComp.drawables.put(
                "Rect0",
                new draw.ShapeDrawable(new draw.RectangleShape(new math.Vector(20, 20)), "Rect1"));
            collisionComp.info.dimension.x = 15;
            collisionComp.info.dimension.y = 15;
            this.context.commandQueue.pushCommand(new AddEntityCommand(this.entitySystem, rectEntity));
        }

    }

}
