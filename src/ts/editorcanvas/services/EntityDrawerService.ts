module editorcanvas.services {
    import draw = entityframework.components.drawing;
    import comp = entityframework.components;
    import datastructures = util.datastructures;

    /**
     * Used to retrieve display objects for entities.
     */
    @framework.ContextKey("editorcanvas.services.EntityDrawerService")
    export class EntityDrawerService {

        /**
         * Gets a DisplayObject for the entity that can be used to represent it on the
         * canvas.
         * @param entity The entity to get a DisplayObject for.
         */
        getEntityDisplayable(entity : entityframework.Entity) : datastructures.PriorityQueue<createjs.DisplayObject> {
            var drawablePriorityQueue = this.getDrawableDisplayable(entity);
            var collision = this.getCollisionDisplayable(entity);
            if (collision) {
                drawablePriorityQueue.push(Number.MAX_VALUE, collision);
            }

            return drawablePriorityQueue;
        }

        private getDrawableDisplayable(entity : entityframework.Entity) : datastructures.PriorityQueue<createjs.DisplayObject> {
            var container = new createjs.Container();

            var posComp = entity.getComponent<comp.PositionComponent>("position");
            var drawComp  = entity.getComponent<draw.DrawableComponent>("drawable");

            if (drawComp && posComp && drawComp.topDrawable) {
                container.addChild(drawComp.topDrawable.getCanvasDisplayObject(posComp.position));
                container.x = posComp.position.x;
                container.y = posComp.position.y;
            }

            var drawableToReturn = new datastructures.PriorityQueue<createjs.DisplayObject>();
            if (container.children.length > 0) {
                drawableToReturn.push(drawComp.topDrawable.renderPriority, container);
            }
            return drawableToReturn;
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
                collisionDrawable = boundingBox.getDrawable(posComp.position);
            }

            return collisionDrawable;
        }
    }
}
