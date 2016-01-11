module editorcanvas.services {

    import draw = entityframework.components.drawing;
    import comp = entityframework.components;
    import datastructures = util.datastructures;

    /**
     * Service used to try and select an entity.
     */
    @framework.ContextKey("editorcanvas.services.EntitySelectService")
    export class EntitySelectService {
        private context : framework.Context;

        constructor(context : framework.Context) {
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
        findSelectableEntity(coords : math.Vector) : string {
            var selectableEntityKey = "";

            var entitiesByPriority = this.context.getSharedObject(services.EntityRenderSortService).getEntitiesByPriority(true);
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
        private canSelectEntity(entityKey : string, coords : math.Vector) : boolean {
            var canSelect = false;
            var entity : entityframework.Entity = this.context.getSharedObject(entityframework.EntitySystem).getEntity(entityKey);
            var positionComp = entity.getComponent<comp.PositionComponent>("position");
            var drawComp = entity.getComponent<draw.DrawableComponent>("drawable");
            if (positionComp && drawComp) {
                var position = positionComp.position;
                var contains = drawComp.topDrawable.contains(
                    coords,
                    position,
                    this.context.getSharedObject(util.resource.ResourceManager));
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
}
