import {Attribute, Map, System, Components} from './map-format';

interface AttributeMigration {
    (attribute : Attribute) : Attribute;
}

interface EntityMigration {
    (entity : Entity) : Entity;
}

interface MigrationTest {
    before : any,
    after : any,
    testName : string
}

type Entity = {[systemName:string]:Attribute};

/**
 * Instances of this class are passed to migration code in order to simplify creation
 * of migrations.
 */
export class MigrationTools {
    /**
     * Create a map migration from a migration that runs over the attributes of a system.
     *
     * //Example migration that renames the velocity field to speed.
     * module.exports = function (tools) {
     *    return tools.attributeMigration("position", function (positionAttribute) {
     *        return {position: positionAttribute.position, speed : positionAttribute.velocity};
     *    });
     * }
     *
     * @param  systemName Name of the system the migration is running over.
     * @param  migration A function that takes a pre-migration attribute and returns the post migration attribute.
     * @return A migration that runs over a map.
     */
    attributeMigration(systemName : string, migration : AttributeMigration) {
        return (map : Map) : Map => {
            if (!map.systems[systemName]) {
                return map;
            }

            let newComponents : Components = {};
            let oldComponents : Components = map.systems[systemName].components;
            for (let attributeKey in oldComponents)
            {
                let migratedAttribute = migration(oldComponents[attributeKey]);
                if (migratedAttribute) {
                    newComponents[attributeKey] = migratedAttribute;
                }
            }
            let newSystem: System = {...map.systems[systemName], components : newComponents};
            let systemPatch : {[systemName : string]: System} = {};
            systemPatch[systemName] = newSystem;
            let systems = {...map.systems, ...systemPatch};
            return Object.assign({}, map, {systems});
        }
    }

    /**
     * Create a map migration from a migration that runs over an entity.
     *
     * //Example migration that adds a button attribute to every entity with no position attribute.
     * module.exports = function (tools) {
     *    return tools.entityMigration(function (entity) {
     *        if (entity.position) {
     *            return entity;
     *        } else {
     *            return {...entity, button: {key: "TheKey"}};
     *        }
     *    });
     * }
     *
     * @param  entityMigration Function that takes a pre-migration entity and returns a post migration entity.
     * @return a migration that runs over a map.
     */
    entityMigration(entityMigration : EntityMigration) {
        return (map : Map) : Map => {
            let systems : {[systemName : string] : System} = {};
            for (let entityKey of map.entities) {
                let migratedEntity = entityMigration(this.getEntity(map, entityKey));
                for (let systemKey in migratedEntity) {

                    if (!systems[systemKey]) {
                        systems[systemKey] = {components : {}};
                    }

                    systems[systemKey].components[entityKey] = migratedEntity[systemKey];
                }
            }
            return {...map, systems};
        }
    }

    /**
     * Get an entity from the raw map.
     * @param  map The map file that is being converted.
     * @param  entityKey The key of the entity to find.
     * @return The entity corresponding to the key.
     */
    getEntity(map : Map, entityKey : string) : Entity {
        let entity : Entity = {};

        for (let systemKey in map.systems) {
            let attribute = map.systems[systemKey].components[entityKey];
            if (attribute) {
                entity[systemKey] = attribute;
            }
        }

        return entity;
    }
}
