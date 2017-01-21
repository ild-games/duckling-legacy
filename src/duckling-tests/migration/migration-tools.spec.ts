import {expect} from 'chai';

import {Map} from '../../duckling/migration/map-format';
import {MigrationTools} from '../../duckling/migration/migration-tools';

const MAP = {
    entities : ["entityA", "entityB"],
    systems : {
        systemA : {
            components : {
                entityA : {
                    A : "A"
                },
                entityB : {
                    A : "B"
                }
            }
        },
        systemB : {
            components : {
                entityA : {
                    B : "A"
                },
                entityB : {
                    B : "B"
                }
            }
        }
    },
    otherThing : "YEP!"
}

function clone(object : any) {
    return JSON.parse(JSON.stringify(object));
}

describe("MigrationTools.attributeMigration", function() {
    let tools : MigrationTools;
    beforeEach(function() {
        tools = new MigrationTools();
    });

    it("Passing it the identify function produces an identity migration", function() {
        let migration = tools.attributeMigration("systemB", (attribute : any) => attribute);
        expect(migration(clone(MAP))).to.eql(MAP);
    });

    it("Returning null removes the component from the entity", function() {
        let migration = tools.attributeMigration("systemB", (attribute : any) => attribute.B === "A" ? null : attribute);
        expect(migration(clone(MAP))).to.eql(
            {
                ...MAP,
                systems : {
                    ...MAP.systems,
                    systemB : {
                        components : {
                            entityB : { B : "B"}
                        }
                    }
                }
            });
    });

    it("Deleting a component does not modify the original map", function() {
        let migration = tools.attributeMigration("systemB", (attribute : any) => attribute.B === "A" ? null : attribute);
        let original = clone(MAP);
        migration(original);
        expect(original).to.eql(MAP);
    });

    it("Returning a new attribute updates the attribute in the new map", function() {
        let migration = tools.attributeMigration("systemB", (attribute : any) => attribute.B === "A" ? {B : "CHANGED"} : attribute);
        expect(migration(clone(MAP))).to.eql({
                ...MAP,
                systems : {
                    ...MAP.systems,
                    systemB : {
                        components : {
                            entityA : { B : "CHANGED"},
                            entityB : { B : "B"}
                        }
                    }
                }
            });
    });
});

describe("MigrationTools.entityMigration", function() {
    let tool = new MigrationTools();

    it("Can be used to add and remove attributes", function() {
        let migration = tool.entityMigration((entity : any) => {
            return {
                systemA : entity.systemA,
                systemC : {
                    NEW : entity.systemB.B
                }
            }
        });
        expect(migration(MAP as any)).to.eql({
            ...MAP,
            systems : {
                systemA : MAP.systems.systemA,
                systemC : {
                    components : {
                        entityA : {
                            NEW : "A"
                        },
                        entityB : {
                            NEW : "B"
                        }
                    }
                }
            },
        });
    });

    it("Deletes a system if there are no remaining attributes", function() {
        let migration = tool.entityMigration((entity : any) => {
            return {
                systemA : entity.systemA,
            }
        });
        expect(migration(MAP as any)).to.eql({
            ...MAP,
            systems : {
                systemA : MAP.systems.systemA,
                }
            });
    });
});

describe("MigrationTools.getEntity", function() {
    let tool = new MigrationTools();

    it("Called on a fake entity returns {}", function() {
        expect(tool.getEntity(MAP as any, "SUPERFAKE")).to.eql({});
    });

    it("Called on an empty map returns {}", function() {
        expect(tool.getEntity({systems : {}} as Map, "SUPERFAKE")).to.eql({});
    });

    it("Returns the entity you request", function() {
        expect(tool.getEntity(MAP as any, "entityB")).to.eql({
            systemA : {
                A : "B"
            },
            systemB : {
                B : "B"
            }
        });
    });
});
