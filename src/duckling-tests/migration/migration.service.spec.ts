import {expect} from 'chai';

import {MigrationService, ProjectVersionInfo} from '../../duckling/migration/migration.service';
import {PathService} from '../../duckling/util/path.service';
import {ChangeType, changeType} from '../../duckling/state/object-diff';

const MIGRATION_FILE : ProjectVersionInfo = {
    mapVersion : "5.0",
    mapMigrations : [
        {
            type : "code",
            updateTo : "1.0",
            name : "skip1"
        },
        {
            type : "code",
            updateTo : "3.0",
            name : "3.0"
        },
        {
            type : "code",
            updateTo : "4.0",
            name : "4.0"
        },
        {
            type : "code",
            updateTo : "4.0",
            name : "4.0"
        },
        {
            type : "code",
            updateTo : "2.0",
            name : "2.0"
        },
        {
            type : "code",
            updateTo : "5.0",
            name : "5.0"
        },
        {
            type : "code",
            updateTo : "6.0",
            name : "skip6"
        },
    ]
}

class TestService extends MigrationService {
    lastMigration : string = "";
    migrations : string [] = [];

    protected _getMigration(migration : any, migrationRoot : string) : any {
        this.migrations.push(migration.name);
        expect(migrationRoot).to.eql("THE_ROOT");
        return (map: any) => {
            expect(map.lastMigration).to.eql(this.lastMigration);
            this.lastMigration = migration.name;
            return {...map, lastMigration : this.lastMigration};
        }
    }
}

describe("MigrationService", function() {
    let migrationService : TestService;
    beforeEach(function() {
        migrationService = new TestService(new PathService(), null);
    });

    it("Runs migrations in the order required to update the map to the correct version", async function() {
        let map = await migrationService.migrateMap({version : "1.0", lastMigration : ""}, MIGRATION_FILE, "THE_ROOT");
        expect(migrationService.migrations).to.eql(["2.0", "3.0", "4.0", "4.0", "5.0"]);
    });
});
