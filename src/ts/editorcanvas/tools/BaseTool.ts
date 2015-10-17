module editorcanvas.tools {
    export class BaseTool implements Tool {
        protected context : framework.Context;
        protected canvas : editorcanvas.CanvasVM;
        protected entitySystem : entityframework.EntitySystem;

        onBind(context : framework.Context, canvas : editorcanvas.CanvasVM) {
            this.context = context;
            this.canvas = canvas;
            this.entitySystem = context.getSharedObject(entityframework.EntitySystem);
        }

        onEvent(event) {
            switch (event.type) {
                case "click":
                    this.onLeftClick(new math.Vector(event.stageX, event.stageY));
                    break;
            }
        }

        onLeftClick(position : math.Vector) {
        }
    }
}
