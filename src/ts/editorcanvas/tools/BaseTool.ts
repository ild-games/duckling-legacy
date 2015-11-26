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

        getDisplayObject() : createjs.DisplayObject {
            return null;
        }

        onEvent(event) {
            switch (event.type) {
                case "click":
                    if (event.nativeEvent.button === 0) {
                        this.onLeftClick(new math.Vector(event.stageX, event.stageY));
                    }
                    break;
                case "stagemousedown":
                    this.onStageDown(new math.Vector(event.stageX, event.stageY));
                    break;
                case "stagemouseup":
                    this.onStageUp(new math.Vector(event.stageX, event.stageY));
                    break;
                case "stagemousemove":
                    this.onStageMove(new math.Vector(event.stageX, event.stageY));
                    break;
            }
        }

        onLeftClick(position : math.Vector) {
        }

        onStageDown(position : math.Vector) {
        }

        onStageUp(position : math.Vector) {
        }

        onStageMove(position : math.Vector) {
        }

        get key() : string {
            throw new Error("Not yet implemented");
        }

        get label() : string {
            throw new Error("Not yet implemented");
        }
    }
}
