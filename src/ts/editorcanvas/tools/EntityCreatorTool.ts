///<reference path="BaseTool.ts"/>
module editorcanvas.tools {

    import draw = entityframework.components.drawing;
    import comp = entityframework.components;

    class AddEntityCommand implements framework.command.Command {
        private es : entityframework.EntitySystem;
        private entity : entityframework.Entity;
        private entityId : string;
        private context : framework.Context;

        constructor(es : entityframework.EntitySystem, entity : entityframework.Entity, context : framework.Context) {
            this.es = es;
            this.entity = entity;
            this.context = context;
            this.entityId = this.es.nextKey();
        }

        execute() {
            this.es.addEntity(this.entityId, this.entity);
            var selectedEntity = this.context.getSharedObjectByKey("selectedEntity");
            selectedEntity.entityKey = this.entityId;
            this.context.setSharedObjectByKey("selectedEntity", selectedEntity);
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
            var physComp = new comp.PositionComponent();
            var drawComp = new draw.DrawableComponent();
            var collisionComp = new comp.CollisionComponent();
            rectEntity.addComponent("position", physComp);
            rectEntity.addComponent("drawable", drawComp);
            rectEntity.addComponent("collision", collisionComp);
            physComp.position.x = mousePos.x;
            physComp.position.y = mousePos.y;

            //drawComp.topDrawable.addDrawable(
            //    new draw.ShapeDrawable(new draw.RectangleShape(new math.Vector(20, 20)), "Rect1"));
            collisionComp.info.dimension.x = 15;
            collisionComp.info.dimension.y = 15;
            this.context.commandQueue.pushCommand(
                new AddEntityCommand(this.entitySystem, rectEntity, this.context));
        }

    }

}
