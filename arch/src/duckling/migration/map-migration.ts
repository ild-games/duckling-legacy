import {
    MapVersion,
    compareVersions,
    versionCompareFunction,
    VersionCompatibility,
} from "../util/version";
/**
 * Represents a single migration that needs to be run when updating to the specified version.
 */
export interface MapMigration {
    updateTo: MapVersion;
    name?: string; // e.g. "ExistingCodeMigration.EditCollisionTypes"
    path?: string; // e.g. "migrations/updatecoins"
    options?: any;
}

/**
 * Determine which migrations need to be run.
 * @param  currentVersion The version of whatever is about to be updated.
 * @param  nextVersion The version to update to.
 * @param  migrations The array of known migrations.
 * @return Array of migrations to run and the order to run them.
 */
export function migrationsToRun(
    currentVersion: MapVersion,
    nextVersion: MapVersion,
    migrations: MapMigration[]
): MapMigration[] {
    return migrations
        .filter((migration) => {
            let alreadyRun =
                versionCompareFunction(migration.updateTo, currentVersion) <= 0;
            let versionOverflow =
                versionCompareFunction(nextVersion, migration.updateTo) < 0;
            return !(alreadyRun || versionOverflow);
        })
        .sort((migrationA, migrationB) =>
            versionCompareFunction(migrationA.updateTo, migrationB.updateTo)
        );
}
