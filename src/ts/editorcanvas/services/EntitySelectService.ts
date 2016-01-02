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

            var entitiesByPriority : { [priority : number] : Array<{ entity : entityframework.Entity, key  : string}>} = {};
            var priorities = [];
            entitySystem.forEach((entity : entityframework.Entity, key : string) => {
                var drawableComp = entity.getComponent<draw.DrawableComponent>("drawable");
                if (drawableComp && drawableComp.topDrawable) {
                    var priority = drawableComp.topDrawable.renderPriority;
                    priorities.push(priority);
                    if (!entitiesByPriority[priority]) {
                        entitiesByPriority[priority] = new Array<{ entity : entityframework.Entity, key : string}>();
                    }
                    entitiesByPriority[priority].push({
                        entity: entity,
                        key: key
                    });
                }
            });
            priorities.sort();
            for (var i = priorities.length - 1; i >= 0; i--) {
                var priority = priorities[i];
                entitiesByPriority[priority].forEach((entityObj) => {
                    if (selectableEntityKey === "") {
                        var positionComp = entityObj.entity.getComponent<comp.PositionComponent>("position");
                        if (positionComp) {
                            var position = positionComp.position;
                            var contains = entityObj.entity.getComponent<draw.DrawableComponent>("drawable").topDrawable.contains(coords, position);
                            if (contains) {
                                selectableEntityKey = entityObj.key;
                            }
                        }
                    }
                });
            };
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
