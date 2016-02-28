import Vector from '../../math/Vector';
import Context from '../../framework/context/Context';
import BaseTool from './BaseTool';
import EntitySelectService from '../services/EntitySelectService';
import CanvasVM from '../CanvasVM';

/**
 * Tool used to select an entity on the canvas.
 */
export default class EntitySelectTool extends BaseTool {
    private selectService : EntitySelectService = null;

    onBind(context : Context) {
        super.onBind(context);
        this.selectService = context.getSharedObject(EntitySelectService)
    }

    onLeftClick(mousePos : Vector, canvas : CanvasVM) {
        var localCoords = canvas.stage.globalToLocal(mousePos.x, mousePos.y);
        var selectableEntityKey = this.selectService.findSelectableEntity(new Vector(localCoords.x, localCoords.y));
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
