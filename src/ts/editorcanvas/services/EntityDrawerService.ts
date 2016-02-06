module editorcanvas.services {
    import draw = entityframework.components.drawing;
    import comp = entityframework.components;

    /**
     * Used to retrieve display objects for entities.
     */
    @framework.ContextKey("editorcanvas.services.EntityDrawerService")
    export class EntityDrawerService {
        private context : framework.Context;

        constructor(context : framework.Context) {
            this.context = context;
        }

        /**
         * Gets a DisplayObject for the entity that can be used to represent it on the
         * canvas.
         * @param entity The entity to get a DisplayObject for.
         */
         getEntityDisplayable(entity : entityframework.Entity) : createjs.Container {
            var container = new createjs.Container();

            var posComp = entity.getComponent<comp.PositionComponent>("position");
            var drawComp  = entity.getComponent<draw.DrawableComponent>("drawable");

            if (drawComp && drawComp.topDrawable) {
                container.addChild(drawComp.topDrawable.getCanvasDisplayObject(this.context.getSharedObject(util.resource.ResourceManager)));
            }
            var collision = this.getCollisionDisplayable(entity);
            if (collision) {
                container.addChild(collision);
            }
            if (posComp) {
                container.x = posComp.position.x;
                container.y = posComp.position.y;
            }
            return container;
        }

        private getCollisionDisplayable(entity :entityframework.Entity) : createjs.DisplayObject {
            var posComp = entity.getComponent<comp.PositionComponent>("position");
            var collisionComp = entity.getComponent<comp.CollisionComponent>("collision");
            var collisionDrawable : createjs.DisplayObject = null;
            if (collisionComp && posComp) {
                var color = "#000000";
                switch (collisionComp.bodyType) {
                    case comp.BodyType.NONE:
                        color = "#0000ff";
                        break;
                    case comp.BodyType.ENVIRONMENT:
                        color = "#009900";
                        break;
                    case comp.BodyType.SOLID:
                        color = "#ff0000";
                        break;
                }

                var boundingBox = new drawing.BoundingBox(collisionComp.info.dimension, color);
                collisionDrawable = boundingBox.getDrawable();
            }

            return collisionDrawable;
        }
    }
}
