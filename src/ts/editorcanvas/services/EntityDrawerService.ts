module editorcanvas.services {
    import draw = entityframework.components.drawing;
    import comp = entityframework.components;

    /**
     * Used to retrive display objects for entities.
     */
    @framework.ContextKey("editorcanvas.services.EntityDrawerService")
    export class EntityDrawerService {

        /**
         * Gets a DisplayObject for the entity that can be used to represent it on the
         * canvas.
         * @param entity The entity to get a DisplayObject for.
         */
        getEntityDisplayable(entity : entityframework.Entity) : createjs.DisplayObject {
            var container = new createjs.Container();

            var drawable = this.getDrawableDisplayable(entity);
            if (drawable) {
                container.addChild(drawable);
            }

            var collision = this.getCollisionDisplayable(entity);
            if (collision) {
                container.addChild(collision);
            }

            return container;
        }

        private getDrawableDisplayable(entity : entityframework.Entity) {
            var container = new createjs.Container();

            var posComp = entity.getComponent<comp.PhysicsComponent>("physics");
            var drawComp  = entity.getComponent<draw.DrawableComponent>("drawable");

            if (drawComp && posComp) {
                drawComp.drawables.forEach((drawable, key) => {
                    var rect : drawing.Rectangle = this.makeCanvasRectangle(
                        posComp,
                        <draw.RectangleShape>(<draw.ShapeDrawable>(drawable)).shape);
                    container.addChild(rect.getDrawable());
                });
            }

            if (container.children.length > 0) {
                return container;
            } else {
                return null;
            }
        }

        private makeCanvasRectangle(posComp : comp.PhysicsComponent, rect : draw.RectangleShape) : drawing.Rectangle {
            var leftPoint = new drawing.CanvasPoint(
                posComp.info.position.x - (rect.dimension.x / 2),
                posComp.info.position.y - (rect.dimension.y /2));
            var rightPoint = new drawing.CanvasPoint(
                leftPoint.x + rect.dimension.x, leftPoint.y + rect.dimension.y);

            return new drawing.Rectangle(leftPoint, rightPoint);
        }

        private getCollisionDisplayable(entity :entityframework.Entity) {
            var posComp = entity.getComponent<comp.PhysicsComponent>("physics");
            var collisionComp = entity.getComponent<comp.CollisionComponent>("collision");
            if (collisionComp && posComp) {
                var leftPoint = new drawing.CanvasPoint(
                    posComp.info.position.x - (collisionComp.info.dimension.x / 2),
                    posComp.info.position.y - (collisionComp.info.dimension.y / 2));
                var rightPoint = new drawing.CanvasPoint(
                    leftPoint.x + collisionComp.info.dimension.x, leftPoint.y + collisionComp.info.dimension.y);

                var color = "#000000";
                switch (collisionComp.bodyType) {
                    case entityframework.components.CollisionBodyType.None:
                        color = "#0000ff";
                        break;
                    case entityframework.components.CollisionBodyType.Environment:
                        color = "#009900";
                        break;
                    case entityframework.components.CollisionBodyType.Solid:
                        color = "#ff0000";
                        break;
                }

                var boundingBox = new drawing.BoundingBox(leftPoint, rightPoint, color);
                return boundingBox.getDrawable()
            }

            return null;
        }
    }
}
