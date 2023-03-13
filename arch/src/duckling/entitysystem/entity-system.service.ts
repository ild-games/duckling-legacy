import { Injectable, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { StoreService, clearUndoHistoryAction } from "../state";
import { EntitySystem, Entity, EntityKey, createEntitySystem } from "./entity";
import {
    updateEntityAction,
    updateEntitiesAction,
    replaceSystemAction,
    deleteEntityAction,
    renameEntityAction,
} from "./entity-system.reducer";

/**
 * The EntitySystemService is used to provide convinient access to the EntitySystem.
 */
@Injectable()
export class EntitySystemService {
    private _nextKey = 0;
    entitySystem: BehaviorSubject<EntitySystem>;

    constructor(private _storeService: StoreService) {
        this.entitySystem = new BehaviorSubject(this._system);
        this._storeService.state.subscribe((state) => {
            this.entitySystem.next(state.entitySystem);
        });
    }

    /**
     * Retrieve a single entity.
     * @param  key Key of the entitity to retrieve.
     * @return The entity.
     */
    getEntity(key: EntityKey): Entity {
        return this._system.get(key);
    }

    /**
     * Retrieve a list of entities
     */
    getEntities(keys: EntityKey[]): Entity[] {
        let entities: Entity[] = [];
        for (let key of keys) {
            entities.push(this.getEntity(key));
        }
        return entities;
    }

    /**
     * Update the entity. Can be used to create new entities.
     * @param  key    Key of the entity to update.
     * @param  entity Entity that will be stored with the key.
     * @param  mergeKey Used to merge updates.
     */
    updateEntity(key: EntityKey, entity: Entity, mergeKey?: any) {
        this._storeService.dispatch(updateEntityAction(entity, key), mergeKey);
    }

    updateEntities(entities: Map<EntityKey, Entity>, mergeKey?: any) {
        this._storeService.dispatch(updateEntitiesAction(entities), mergeKey);
    }

    /**
     * Add a new entity to the entity system.
     * @param  entity The entity that is being added to the system.
     * @param  mergeKey Used to merge updates.
     * @return The key of the newly created entity.
     */
    addNewEntity(
        entity: Entity,
        preferredKey?: string,
        mergeKey?: any
    ): EntityKey {
        let key: string = "";
        if (preferredKey !== "" && !this._system.get(preferredKey)) {
            key = preferredKey;
        }
        if (key === "") {
            key = this._generateNextKey();
        }
        this.updateEntity(key, entity, mergeKey);
        return key;
    }

    /**
     * Delete the entity.
     * @param  entityKey Key of the entity to delete.
     * @param  mergeKey  Used to merge updates.
     */
    deleteEntity(entityKey: EntityKey, mergeKey?: any) {
        this._storeService.dispatch(deleteEntityAction(entityKey), mergeKey);
    }

    /**
     * Renames an entity
     * @param  oldEntityKey The old key of the entity to be renamed
     * @param  newEntityKey The new key of the entity to be renamed
     * @param  mergeKey     Used to merge updates.
     */
    renameEntity(
        oldEntityKey: EntityKey,
        newEntityKey: EntityKey,
        mergeKey?: any
    ) {
        this._storeService.dispatch(
            renameEntityAction(oldEntityKey, newEntityKey),
            mergeKey
        );
    }

    /**
     * Load the system stored in the file.
     * @param  path The path the system is stored in.
     */
    replaceSystem(entitySystem: EntitySystem) {
        this._storeService.dispatch(replaceSystemAction(entitySystem));
    }

    private get _system(): EntitySystem {
        let state = this._storeService.getState();
        if (state && state.entitySystem) {
            return state.entitySystem;
        } else {
            return createEntitySystem();
        }
    }

    private _generateNextKey(): string {
        let next = this._nextKey++;
        while (this._system.get(String(next), null)) {
            next = this._nextKey++;
        }
        return String(next);
    }
}
