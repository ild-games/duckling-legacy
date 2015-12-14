module editorcanvas.services {

    import draw = entityframework.components.drawing;
    import comp = entityframework.components;

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
            var entitySystem = this.context.getSharedObject(entityframework.EntitySystem);
            entitySystem.forEach((entity : entityframework.Entity, key : string) => {
                var positionComp = entity.getComponent<comp.PositionComponent>("position");
                var drawable = entity.getComponent<draw.DrawableComponent>("drawable");
                if (positionComp && drawable && drawable.topDrawable) {
                    var position = positionComp.position;
                    var contains = drawable.topDrawable.contains(coords, position);
                    if (contains) {
                        selectableEntityKey = key;
                    }
                }
            });
            return selectableEntityKey;
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
