module editorcanvas.tools {
    export class BaseTool implements Tool {
        protected context : framework.Context;
        protected lastEvent = null;

        onBind(context : framework.Context) {
            this.context = context;
        }

        getDisplayObject() : createjs.DisplayObject {
            return null;
        }

        onEvent(event, canvas : editorcanvas.CanvasVM) {
            this.lastEvent = event;
            if (this.allowedMouseButtons.indexOf(this.lastEventMouseButton) === -1) {
                return;
            }

            switch (event.type) {
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

        get allowedMouseButtons() : Array<Number> {
            return [ BaseTool.LEFT_MOUSE_BUTTON, BaseTool.RIGHT_MOUSE_BUTTON, BaseTool.MIDDLE_MOUSE_BUTTON ];
        }

        protected get lastEventMouseButton() : number {
            var toReturn : number = -1;
            if (this.lastEvent && this.lastEvent.nativeEvent && this.lastEvent.nativeEvent.button !== undefined) {
                toReturn = this.lastEvent.nativeEvent.button;
            }
            return toReturn;
        }

        protected static get LEFT_MOUSE_BUTTON() : number {
            return 0;
        }

        protected static get RIGHT_MOUSE_BUTTON() : number {
            return 2;
        }

        protected static get MIDDLE_MOUSE_BUTTON() : number {
            return 1;
        }
    }
}
