///<reference path="BaseTool.ts"/>
module editorcanvas.tools {

    import draw = entityframework.components.drawing;
    import comp = entityframework.components;

    /**
     * Tool used to select an entity on the canvas.
     */
    export class EntitySelectTool extends BaseTool {
        onLeftClick(mousePos : math.Vector) {
            this.selectEntity(mousePos);
        }

        private selectEntity(mousePos : math.Vector) {
            this.entitySystem.forEach((entity : entityframework.Entity, key : string) => {
                var position = entity.getComponent<comp.PhysicsComponent>("physics").info.position;
                var drawable = entity.getComponent<draw.DrawableComponent>("drawable");
                if (position && drawable) {
                    drawable.drawables.forEach((obj, drawableKey) => {
                        if (obj && (<draw.ShapeDrawable>obj).shape.contains(mousePos, position)) {
                            var selectedEntity = this.context.getSharedObjectByKey("selectedEntity");
                            selectedEntity.entityKey = key;
                            this.context.setSharedObjectByKey("selectedEntity", selectedEntity);
                            return;
                        }
                    });
                }
            });
        }
    }
}
