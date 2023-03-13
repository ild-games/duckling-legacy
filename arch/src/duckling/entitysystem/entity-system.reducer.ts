import {
    createEntitySystem,
    Entity,
    EntityKey,
    EntitySystem,
} from "../entitysystem";
import { Action, changeType, ChangeType } from "../state";

const ACTION_UPDATE_ENTITY = "EntitySystem.UpdateEntity";

/**
 *  Action used to describe updates to a specific entity. If no entity with the
 *  given key exists, then a new entity will be created.
 */
export interface EntityUpdateAction extends Action {
    entity: Entity;
    entityKey: EntityKey;
}

/**
 * Factory function for a EntityUpdateAction
 * @param  entity    New value for the entity.
 * @param  entityKey The entity's key.
 * @return A new EntityUpdateAction.
 */
export function updateEntityAction(
    entity: Entity,
    entityKey: EntityKey
): EntityUpdateAction {
    return {
        type: ACTION_UPDATE_ENTITY,
        entity,
        entityKey,
    };
}

function _isUpdateEntityAction(action: Action): action is EntityUpdateAction {
    return action.type === ACTION_UPDATE_ENTITY;
}

const ACTION_UPDATE_ENTITIES = "EntitySystem.UpdateEntities";

/**
 *  Action used to describe updates to multiple entities. If no entity with the
 *  given key exists, then a new entity will be created.
 */
export interface EntitiesUpdateAction extends Action {
    entities: Map<EntityKey, Entity>;
}

/**
 * Factory function for a EntitiesUpdateAction
 * @param  entities    New value for the entities.
 * @param  entityKeys The keys for the entities
 * @return A new EntitiesUpdateAction.
 */
export function updateEntitiesAction(
    entities: Map<EntityKey, Entity>
): EntitiesUpdateAction {
    return {
        type: ACTION_UPDATE_ENTITIES,
        entities,
    };
}

function _isUpdateEntitiesAction(
    action: Action
): action is EntitiesUpdateAction {
    return action.type === ACTION_UPDATE_ENTITIES;
}

/**
 *  Action used to replace the current entity system with another.
 */
export interface ReplaceSystemAction extends Action {
    entitySystem: EntitySystem;
}

const ACTION_REPLACE_SYSTEM = "EntitySystem.ReplaceSystem";

/**
 * Create an action that can be used to replace the existing entity system. useful
 * after a load finishes.
 * @param  newSystem The new system to place in the store.
 * @return Dispatchable action that replaces the existing entity sytem..
 */
export function replaceSystemAction(newSystem: EntitySystem) {
    return {
        type: ACTION_REPLACE_SYSTEM,
        entitySystem: newSystem,
    };
}

function _isReplaceSystemAction(action: Action): action is ReplaceSystemAction {
    return action.type === ACTION_REPLACE_SYSTEM;
}

/**
 * Action used to delete an entity.
 */
export interface DeleteEntityAction extends Action {
    key: EntityKey;
}

/**
 * Create an action that will delete the entity.
 * @param  key Key of the entity to delete.
 * @return An action that will delete the entity.
 */
export function deleteEntityAction(key: EntityKey) {
    return {
        type: ACTION_DELETE_ENTITY,
        key,
    };
}

const ACTION_DELETE_ENTITY = "EntitySystem.DeleteEntity";
function _isDeleteEntityAction(action: Action): action is DeleteEntityAction {
    return action.type === ACTION_DELETE_ENTITY;
}

/**
 * Action used to rename an entity.
 */
export interface RenameEntityAction extends Action {
    oldKey: EntityKey;
    newKey: EntityKey;
}

/**
 * Create an action that will rename an entity.
 * @param  oldKey Key of the entity to rename.
 * @param  newKey New key of the entity being renamed.
 * @return An action that will rename the entity.
 */
export function renameEntityAction(oldKey: EntityKey, newKey: EntityKey) {
    return {
        type: ACTION_RENAME_ENTITY,
        oldKey,
        newKey,
    };
}

const ACTION_RENAME_ENTITY = "EntitySystem.RenameEntity";
function _isRenameEntityAction(action: Action): action is RenameEntityAction {
    return action.type === ACTION_RENAME_ENTITY;
}

/**
 * Determine if two entity update actions should be merged.  The entity update actions will
 * be merged if they affect a single field in the entity. This prevents the user from needing to
 * undo individual characters when the modify an entity using an edit field.
 * @return True if the entity actions should be merged. False otherwise.
 */
export function mergeEntityAction(
    action: EntityUpdateAction,
    previousAction: EntityUpdateAction
): boolean {
    if (
        action.type !== ACTION_UPDATE_ENTITY ||
        previousAction.type !== ACTION_UPDATE_ENTITY
    ) {
        return false;
    }

    if (action.entityKey !== previousAction.entityKey) {
        return false;
    }

    let change = changeType(action.entity, previousAction.entity);
    return change === ChangeType.Equal || change === ChangeType.PrimitiveChange;
}

/**
 * Reducer for the EntitySystem portion of a map.
 */
export function entitySystemReducer(
    entitySystem: EntitySystem = createEntitySystem(),
    action: Action
): EntitySystem {
    if (_isUpdateEntityAction(action)) {
        return entitySystem.set(action.entityKey, action.entity);
    } else if (_isUpdateEntitiesAction(action)) {
        for (let keyEntityPair of action.entities) {
            entitySystem = entitySystem.set(keyEntityPair[0], keyEntityPair[1]);
        }
        return entitySystem;
    } else if (_isReplaceSystemAction(action)) {
        return action.entitySystem;
    } else if (_isDeleteEntityAction(action)) {
        return entitySystem.remove(action.key);
    } else if (_isRenameEntityAction(action)) {
        let oldEntity = entitySystem.get(action.oldKey);
        entitySystem = entitySystem.remove(action.oldKey);
        return entitySystem.set(action.newKey, oldEntity);
    } else {
        return entitySystem;
    }
}
