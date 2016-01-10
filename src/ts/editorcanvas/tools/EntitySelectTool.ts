///<reference path="BaseTool.ts"/>
module editorcanvas.tools {

    /**
     * Tool used to select an entity on the canvas.
     */
    export class EntitySelectTool extends BaseTool {
        private selectService : editorcanvas.services.EntitySelectService = null;

        onBind(context : framework.Context) {
            super.onBind(context);
            this.selectService = context.getSharedObject(services.EntitySelectService)
        }

        onLeftClick(mousePos : math.Vector, canvas : editorcanvas.CanvasVM) {
            var localCoords = canvas.stage.globalToLocal(mousePos.x, mousePos.y);
            var selectableEntityKey = this.selectService.findSelectableEntity(new math.Vector(localCoords.x, localCoords.y));
            if (selectableEntityKey) {
                this.selectService.selectEntity(selectableEntityKey);
            }
        }

        get key() : string {
            return "selectEntity";
        }

        get label() : string {
            return "Select Entity";
        }
    }
}
