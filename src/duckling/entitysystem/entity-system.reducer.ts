import {Entity, EntityKey, EntitySystem} from '../entitysystem';
import {Action} from '../state';

/**
 *  Action used to describe updates to a specific entity. If no entity with the
 *  given key exists, then a new entity will be created.
 */
export interface EntityUpdateAction extends Action {
    entity : Entity;
    entityKey : EntityKey;
}

/**
 * Action key of the EntityUpdateAction
 */
export const ACTION_UPDATE_ENTITY = "EntitySystem.UpdateEntity";

/**
 * Factory function for a EntityUpdateAction
 * @param  entity    New value for the entity.
 * @param  entityKey The entity's key.
 * @return A new EntityUpdateAction.
 */
export function updateEntityAction(entity : Entity, entityKey : EntityKey) : EntityUpdateAction {
        return {
            type : ACTION_UPDATE_ENTITY,
            entity,
            entityKey
        }
}

/**
 * Determine if two entity update actions should be merged.  The entity update actions will
 * be merged if they affect a single field in the entity. This prevents the user from needing to
 * undo individual characters when the modify an entity using an edit field.
 * @return True if the entity actions should be merged. False otherwise.
 */
export function mergeEntityAction(action : EntityUpdateAction, previousAction : EntityUpdateAction) : boolean {
    //TODO Implement diff
    return action.entityKey === ACTION_UPDATE_ENTITY && action.entityKey === previousAction.entityKey;
}

/**
 * Reducer for the EntitySystem portion of a map.
 */
export function entitySystemReducer(entitySystem : EntitySystem, action : EntityUpdateAction) : EntitySystem {
    switch (action.type) {
        case ACTION_UPDATE_ENTITY:
            return entitySystem.set(action.entityKey, action.entity);
    }
}
