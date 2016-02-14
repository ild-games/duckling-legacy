import {Entity} from '../../entitysystem/core/Entity';
import {EntitySystem} from '../../entitysystem/core/EntitySystem';
import {PositionComponent} from '../../entitysystem/components/PositionComponent';
import {DrawableComponent} from '../../entitysystem/components/drawing/DrawableComponent';
import {CollisionComponent, BodyType} from '../../entitysystem/components/CollisionComponent';
import ResourceManager from '../../entitysystem/ResourceManager';
import ContextKey from '../../framework/context/ContextKey';
import Context from '../../framework/context/Context';
import Vector from '../../math/Vector';
import CanvasVM from '../CanvasVM';
import EntityRenderSortService from './EntityRenderSortService';

/**
 * Service used to try and select an entity.
 */
@ContextKey("editorcanvas.services.EntitySelectService")
export default class EntitySelectService {
    private context : Context;

    constructor(context : Context) {
        this.context = context;
    }

    /**
     * Finds if there is an entity that can be selected at the given coordinates.
     *
     * @param coords The coordinates used to check if any entity can be selected.
     *
     * @returns Key of the entity that can be selected, empty string if no entity
     * can be selected.
     */
    findSelectableEntity(coords : Vector) : string {
        var selectableEntityKey = "";

        var entitiesByPriority = this.context.getSharedObject(EntityRenderSortService).getEntitiesByPriority(true);
        entitiesByPriority.forEach((entityKey : string) => {
            if (selectableEntityKey === "" && this.canSelectEntity(entityKey, coords)) {
                selectableEntityKey = entityKey;
            }
        });

        return selectableEntityKey;
    }

    /**
     * Determines if a given entity can be "selected" at the given coordinates.
     *
     * @param entityKey The key of the entity to check if can be selected.
     * @param coords The coordinates used to check if any entity can be selected.
     *
     * @returns true if entity can be selected, otherwise false.
     */
    private canSelectEntity(entityKey : string, coords : Vector) : boolean {
        var canSelect = false;
        var entity : Entity = this.context.getSharedObject(EntitySystem).getEntity(entityKey);
        var positionComp = entity.getComponent<PositionComponent>("position");
        var drawComp = entity.getComponent<DrawableComponent>("drawable");
        if (positionComp && drawComp && drawComp.topDrawable) {
            var position = positionComp.position;
            var contains = drawComp.topDrawable.contains(
                coords,
                position,
                this.context.getSharedObject(ResourceManager));
            if (contains) {
                canSelect = true;
            }
        }
        return canSelect;
    }

    /**
     * Selects the given entity.
     *
     * @param entityKey Key of the entity to select.
     */
    selectEntity(entityKey : string) {
        var sharedSelectedEntity = this.context.getSharedObjectByKey("selectedEntity");
        sharedSelectedEntity.entityKey = entityKey;
        this.context.setSharedObjectByKey("selectedEntity", sharedSelectedEntity);
    }
}
