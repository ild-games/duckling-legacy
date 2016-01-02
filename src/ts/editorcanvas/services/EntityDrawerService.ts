module editorcanvas.services {
    import draw = entityframework.components.drawing;
    import comp = entityframework.components;

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
        getEntityDisplayable(entity : entityframework.Entity) : { [priority : number] : Array<createjs.DisplayObject> } {
            var drawableObj = this.getDrawableDisplayable(entity);
            var collision = this.getCollisionDisplayable(entity);
            if (collision) {
                if (!drawableObj[Number.MAX_VALUE]) {
                    drawableObj[Number.MAX_VALUE] = [];
                }
                drawableObj[Number.MAX_VALUE].push(collision);
            }

            return drawableObj;
        }

        private getDrawableDisplayable(entity : entityframework.Entity) : { [priority : number] : Array<createjs.DisplayObject>} {
            var container = new createjs.Container();

            var posComp = entity.getComponent<comp.PositionComponent>("position");
            var drawComp  = entity.getComponent<draw.DrawableComponent>("drawable");

            if (drawComp && posComp && drawComp.topDrawable) {
                container.addChild(drawComp.topDrawable.getCanvasDisplayObject(posComp.position));
                container.x = posComp.position.x;
                container.y = posComp.position.y;
            }

            var drawableToReturn : { [priority : number] : Array<createjs.DisplayObject>} = {};
            if (container.children.length > 0) {
                drawableToReturn[drawComp.topDrawable.renderPriority] = [];
                drawableToReturn[drawComp.topDrawable.renderPriority].push(container);
            }
            return drawableToReturn;
        }

        private getCollisionDisplayable(entity :entityframework.Entity) {
            var posComp = entity.getComponent<comp.PositionComponent>("position");
            var collisionComp = entity.getComponent<comp.CollisionComponent>("collision");
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
                return boundingBox.getDrawable(posComp.position);
            }

            return null;
        }
    }
}
