import {Entity} from '../../entitysystem/core/Entity';
import {EntitySystem} from '../../entitysystem/core/EntitySystem';
import {AddEntityCommand} from '../../entitysystem/entityeditor/EntityEditorVM';
import {PositionComponent} from '../../entitysystem/components/PositionComponent';
import {DrawableComponent} from '../../entitysystem/components/drawing/DrawableComponent';
import {CollisionComponent} from '../../entitysystem/components/CollisionComponent';
import Command from '../../framework/command/Command';
import Vector from '../../math/Vector';
import EntitySelectService from '../services/EntitySelectService';
import CanvasVM from '../CanvasVM';
import BaseTool from './BaseTool';

/**
 * Tool used to create a new entity on the canvas. Defaults with
 * basic Position, Collision, and Drawable components.
 */
export default class EntityCreatorTool extends BaseTool {
    onLeftClick(position : Vector, canvas : CanvasVM) {
        var localCoords = canvas.stage.globalToLocal(position.x, position.y);
        this.createBasicEntity(new Vector(localCoords.x, localCoords.y));
    }

    private createBasicEntity(mousePos : Vector) {
        var rectEntity = new Entity();
        var physComp = new PositionComponent();
        var drawComp = new DrawableComponent();
        var collisionComp = new CollisionComponent();
        rectEntity.addComponent("position", physComp);
        rectEntity.addComponent("drawable", drawComp);
        rectEntity.addComponent("collision", collisionComp);
        physComp.position.x = mousePos.x;
        physComp.position.y = mousePos.y;

        collisionComp.info.dimension.x = 15;
        collisionComp.info.dimension.y = 15;
        this.context.commandQueue.pushCommand(
            new AddEntityCommand(rectEntity, this.context));
    }

    get key() : string {
        return "createEntity";
    }

    get label() : string {
        return "Create Entity";
    }
}
