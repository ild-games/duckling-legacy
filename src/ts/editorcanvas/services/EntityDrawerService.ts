import ContextKey from '../../framework/context/ContextKey';
import Context from '../../framework/context/Context';
import {Entity} from '../../entitysystem/core/Entity';
import {EntitySystem} from '../../entitysystem/core/EntitySystem';
import {PositionComponent} from '../../entitysystem/components/PositionComponent';
import {DrawableComponent} from '../../entitysystem/components/drawing/DrawableComponent';
import {CollisionComponent,BodyType} from '../../entitysystem/components/CollisionComponent';
import ResourceManager from '../../entitysystem/ResourceManager';
import CanvasVM from '../CanvasVM';
import BoundingBox from '../drawing/BoundingBox';

/**
 * Used to retrieve display objects for entities.
 */
@ContextKey("editorcanvas.services.EntityDrawerService")
export default class EntityDrawerService {
    private context : Context;

    constructor(context : Context) {
        this.context = context;
    }

    /**
     * Gets a DisplayObject for the entity that can be used to represent it on the
     * canvas.
     * @param entity The entity to get a DisplayObject for.
     */
     getEntityDisplayable(entity : Entity) : createjs.Container {
        var container = new createjs.Container();

        var posComp = entity.getComponent<PositionComponent>("position");
        var drawComp  = entity.getComponent<DrawableComponent>("drawable");

        if (drawComp && drawComp.topDrawable) {
            container.addChild(drawComp.topDrawable.getCanvasDisplayObject(this.context.getSharedObject(ResourceManager)));
        }
        var collision = this.getCollisionDisplayable(entity);
        if (collision) {
            container.addChild(collision);
        }
        if (posComp) {
            container.x = posComp.position.x;
            container.y = posComp.position.y;
        }
        return container;
    }

    private getCollisionDisplayable(entity : Entity) : createjs.DisplayObject {
        var posComp = entity.getComponent<PositionComponent>("position");
        var collisionComp = entity.getComponent<CollisionComponent>("collision");
        var collisionDrawable : createjs.DisplayObject = null;
        if (collisionComp && posComp) {
            var color = "#000000";
            switch (collisionComp.bodyType) {
                case BodyType.NONE:
                    color = "#0000ff";
                    break;
                case BodyType.ENVIRONMENT:
                    color = "#009900";
                    break;
                case BodyType.SOLID:
                    color = "#ff0000";
                    break;
            }

            var boundingBox = new BoundingBox(collisionComp.info.dimension, color);
            collisionDrawable = boundingBox.getDrawable();
        }

        return collisionDrawable;
    }
}
