///<reference path="BaseTool.ts"/>
module editorcanvas.tools {

    import draw = entityframework.components.drawing;
    import comp = entityframework.components;

    class AddEntityCommand implements framework.command.Command {
        private _es : entityframework.EntitySystem;
        private _entity : entityframework.Entity;
        private _entityId : string;

        constructor(es : entityframework.EntitySystem, entity : entityframework.Entity) {
            this._es = es;
            this._entity = entity;
            this._entityId = this._es.nextKey();
        }

        execute() {
            this._es.addEntity(this._entityId, this._entity);
        }

        undo() {
            this._es.removeEntity(this._entityId);
        }
    }

    export class EntityCreatorTool extends BaseTool {
        onLeftClick(position : math.Vector) {
            this.createRectangle(position);
        }

        private createRectangle(mousePos : math.Vector) {
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
