import { Map } from "immutable";

import { ExistingCodeMigration } from "../../migration/existing-code-migration";
import { MigrationTools } from "../../migration/migration-tools";
import { EntitySystem, Entity, EntityKey } from "../../entitysystem/entity";

import { COLLISION_KEY } from "./collision-attribute";

export const EDIT_COLLISION_TYPE_MIGRATION_NAME =
    "ExistingCodeMigration.EditCollisionTypes";

export let editCollisionTypeMigration: ExistingCodeMigration = {
    rawMapFunction: (tools: MigrationTools) => {
        return tools.attributeMigration(
            "collision",
            (attribute: any, options: any) => {
                if (attribute.collisionType === options.oldType) {
                    attribute.collisionType = options.newType;
                }
                return attribute;
            }
        );
    },
    entitySystemFunction: (entitySystem: EntitySystem, options?: any) => {
        return entitySystem.map((entity: Entity) => {
            for (let attributeKey in entity) {
                if (attributeKey === COLLISION_KEY) {
                    if (
                        (entity.collision as any).collisionType ===
                        options.oldType
                    ) {
                        (entity[attributeKey] as any).collisionType =
                            options.newType;
                    }
                }
            }
            return entity;
        }) as Map<EntityKey, Entity>;
    },
    name: EDIT_COLLISION_TYPE_MIGRATION_NAME,
};
