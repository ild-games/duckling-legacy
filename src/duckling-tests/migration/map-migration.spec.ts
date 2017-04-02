import {expect} from "chai";
import {migrationsToRun, MapMigration} from '../../duckling/migration/map-migration';

const MIGRATIONS : MapMigration [] = [
        {
            type : "code",
            updateTo : "1.0",
            name : "skip"
        },
        {
            type : "code",
            updateTo : "3.0",
            name : "3"
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
            name : "2"
        },
        {
            type : "code",
            updateTo : "5.0",
            name : "5"
        },
        {
            type : "code",
            updateTo : "6.0",
            name : "6"
        },
];

describe("migrationsToRun", function() {
    it("upgrading a single version only returns migrations for that jump", function() {
        expect(migrationsToRun("4.0", "5.0", MIGRATIONS)).to.eql([
            {
                type : "code",
                updateTo : "5.0",
                name : "5"
            },
        ])
    });

    it("returns nothing when the map is up to date", function() {
        expect(migrationsToRun("5.0", "5.0", MIGRATIONS)).to.eql([]);
        expect(migrationsToRun("5.1", "5.0", MIGRATIONS)).to.eql([]);
    });

    it("Can return multiple conversions", function() {
        expect(migrationsToRun("1.0", "5.0", MIGRATIONS)).to.eql([
            {
                type : "code",
                updateTo : "2.0",
                name : "2"
            },
            {
                type : "code",
                updateTo : "3.0",
                name : "3"
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
                updateTo : "5.0",
                name : "5"
            }]);
    });

});
