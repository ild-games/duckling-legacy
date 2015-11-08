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
                var positionComp = entity.getComponent<comp.PhysicsComponent>("physics");
                var drawable = entity.getComponent<draw.DrawableComponent>("drawable");
                if (positionComp && drawable && drawable.topDrawable) {
                    var position = positionComp.info.position;
                    var contains = drawable.topDrawable.contains(mousePos, position);
                    if (contains) {
                        var selectedEntity = this.context.getSharedObjectByKey("selectedEntity");
                        selectedEntity.entityKey = key;
                        this.context.setSharedObjectByKey("selectedEntity", selectedEntity);
                    }
                }
            });
        }
    }
}
