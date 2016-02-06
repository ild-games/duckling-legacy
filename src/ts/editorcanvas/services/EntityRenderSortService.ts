module editorcanvas.services {

    import comp = entityframework.components;
    import draw = comp.drawing;
    import datastructures = util.datastructures;

    /**
     * Returns a priority queue of the entity's with drawable components sorted by
     * their render priority.
     */
    @framework.ContextKey("editorcanvas.services.EntityRenderSortService")
    export class EntityRenderSortService {
        private context : framework.Context;

        constructor(context : framework.Context) {
            this.context = context;
        }

        /**
         * Returns the entities in the Entity System with drawable components sorted
         * by their render priority (of the top drawable).
         *
         * @param backwards (Optional) True if the priority queue should sort in descending order,
         *        false if it should sort in ascending order (default).
         */
        getEntitiesByPriority(backwards? : boolean) : datastructures.PriorityQueue<string> {
            var priorityQueue : datastructures.PriorityQueue<string> = new datastructures.PriorityQueue<string>(backwards);

            var entitySystem = this.context.getSharedObject(entityframework.EntitySystem);
            entitySystem.forEach((entity : entityframework.Entity, key : string) => {
                var drawableComp = entity.getComponent<draw.DrawableComponent>("drawable");
                if (drawableComp && drawableComp.topDrawable) {
                    priorityQueue.enqueue(drawableComp.topDrawable.renderPriority + drawableComp.topDrawable.priorityOffset, key);
                } else {
                    if (entity.getComponent<comp.CollisionComponent>("collision")) {
                        priorityQueue.enqueue(Number.MAX_VALUE, key);
                    }
                }
            });
            return priorityQueue;
        }
    }
}
