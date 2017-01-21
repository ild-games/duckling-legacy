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
    attributeMigration(systemName : string, migration : AttributeMigration) {
        return (map : Map) : Map => {
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
