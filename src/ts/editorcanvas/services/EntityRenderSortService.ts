import {Entity} from '../../entitysystem/core/Entity';
import {EntitySystem} from '../../entitysystem/core/EntitySystem';
import ContextKey from '../../framework/context/ContextKey';
import Context from '../../framework/context/Context';
import {DrawableComponent} from '../../entitysystem/components/drawing/DrawableComponent';
import PriorityQueue from '../../util/datastructures/PriorityQueue';

/**
 * Returns a priority queue of the entity's with drawable components sorted by
 * their render priority.
 */
@ContextKey("editorcanvas.services.EntityRenderSortService")
export default class EntityRenderSortService {
    private context : Context;

    constructor(context : Context) {
        this.context = context;
    }

    /**
     * Returns the entities in the Entity System with drawable components sorted
     * by their render priority (of the top drawable).
     *
     * @param backwards (Optional) True if the priority queue should sort in descending order,
     *        false if it should sort in ascending order (default).
     */
    getEntitiesByPriority(backwards? : boolean) : PriorityQueue<string> {
        var priorityQueue : PriorityQueue<string> = new PriorityQueue<string>(backwards);

        var entitySystem = this.context.getSharedObject(EntitySystem);
        entitySystem.forEach((entity : Entity, key : string) => {
            var drawableComp = entity.getComponent<DrawableComponent>("drawable");
            if (drawableComp && drawableComp.topDrawable) {
                priorityQueue.enqueue(drawableComp.topDrawable.renderPriority + drawableComp.topDrawable.priorityOffset, key);
            }
        });
        return priorityQueue;
    }
}
