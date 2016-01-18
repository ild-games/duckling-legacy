module editorcanvas.tools {
    export class BaseTool implements Tool {
        protected context : framework.Context;

        onBind(context : framework.Context) {
            this.context = context;
        }

        getDisplayObject() : createjs.DisplayObject {
            return null;
        }

        onEvent(event, canvas : editorcanvas.CanvasVM) {
            switch (event.type) {
                case "click":
                    if (event.nativeEvent.button === 0) {
                        this.onLeftClick(new math.Vector(event.stageX, event.stageY), canvas);
                    }
                    break;
                case "stagemousedown":
                    this.onStageDown(new math.Vector(event.stageX, event.stageY), canvas);
                    break;
                case "stagemouseup":
                    this.onStageUp(new math.Vector(event.stageX, event.stageY), canvas);
                    break;
                case "stagemousemove":
                    this.onStageMove(new math.Vector(event.stageX, event.stageY), canvas);
                    break;
            }
        }

        onLeftClick(position : math.Vector, canvas : editorcanvas.CanvasVM) {
        }

        onStageDown(position : math.Vector, canvas : editorcanvas.CanvasVM) {
        }

        onStageUp(position : math.Vector, canvas : editorcanvas.CanvasVM) {
        }

        onStageMove(position : math.Vector, canvas : editorcanvas.CanvasVM) {
        }

        get key() : string {
            throw new Error("Not yet implemented");
        }

        get label() : string {
            throw new Error("Not yet implemented");
        }
    }
}
