import {posix} from "path";
import {Injectable} from "@angular/core";

import {rethrow} from '../util/rethrow';
import {JsonLoaderService} from '../util/json-loader.service';
import {PathService} from '../util/path.service';
import {versionCompareFunction, MapVersion, EditorVersion, EDITOR_VERSION} from '../util/version';

import {migrationsToRun, MapMigration} from './map-migration';
import {MigrationTools} from './migration-tools';

/**
* Used for registering migrations and duckling versions during the bootstrap process.
* During runtime it is used to load project migrations and providings all the logic
* for running migrations.
*/
@Injectable()
export class MigrationService {
    private _versionMigrations : {}

    constructor(private _path : PathService, private _jsonLoader : JsonLoaderService) {

    }

    /**
     * Migrate a map to the newest version supported by the editor. Throws if the map is more advanced than the editor supports.
     */
    async migrateMap<T>(map : T, versionInfo : ProjectVersionInfo, migrationRoot : string) : Promise<T> {
        let mapVersion = (map as any).version;

        if (versionCompareFunction(versionInfo.mapVersion, mapVersion) < 0) {
            throw new Error(`Map version ${mapVersion} is greater than the projects expected map version ${versionInfo.mapVersion}`);
        }

        let migrations = migrationsToRun(mapVersion, versionInfo.mapVersion, versionInfo.mapMigrations);

        let result : any = map;
        for (let migration of migrations) {
            let mapMigration = this._getMigration(migration, migrationRoot);
            try {
                result = mapMigration(result);
            } catch (error) {
                throw new Error(`Migration ${migration.name} threw an exception. Consider adding a breakpoint in MigrationService.migrateMap.`);
            }
        }

        return Promise.resolve(result);
    }

    /**
     * Get project migration data and run any migrations that need to be run immediatly.
     * @param  projectPath Path to the project.
     * @return The map version and migration data.
     */
    async openProject(projectPath : string) : Promise<ProjectVersionInfo> {
        let versionFileName = this._path.join(projectPath, "project", "version.json");
        let rawFile = await this._jsonLoader.getJsonFromPath(versionFileName);

        let versionFile : VersionFile;
        if (!rawFile) {
            versionFile = DEFAULT_VERSION_FILE;
            await this._jsonLoader.saveJsonToPath(versionFileName, JSON.stringify(DEFAULT_VERSION_FILE, null, 4));
        } else {
            try {
                versionFile = JSON.parse(rawFile);
            } catch (exception) {
                rethrow(`Error loading "project/version.js"`, exception);
            }
        }

        if (versionCompareFunction(EDITOR_VERSION, versionFile.editorVersion) < 0) {
            throw new Error(`You should update duckling. The project expects editor version ${versionFile.editorVersion}. The current version is  ${EDITOR_VERSION}`);
        }

        return {
            mapMigrations : versionFile.mapMigrations,
            mapVersion : versionFile.projectVersion
        }
    }

    protected _getMigration(migration : MapMigration, migrationRoot : string) : MapMigrationFunction {
        switch (migration.type) {
            case "code":
                return this._loadMapMigration(migration, migrationRoot);
        }
    }

    private _loadMapMigration(migration : MapMigration, migrationRoot : string) : MapMigrationFunction {
        let fileName = this._path.join(migrationRoot, migration.name);
        let mapMigration : MapMigrationFunction;

        try {
            let migrationModule = require(fileName);

            if (typeof migrationModule === 'function') {
                mapMigration = migrationModule(new MigrationTools());
            }

            if (typeof mapMigration !== 'function') {
                throw new Error(`Migration "${migration.name}" does not export a function that returns a function.`);
            }

        } catch (error) {
            rethrow(`Unable to load migration "${migration.name}" from "${fileName}".`, error);
        }

        return mapMigration;
    }
}

export interface ProjectVersionInfo {
    mapMigrations : MapMigration [],
    mapVersion : MapVersion
}

interface MapMigrationFunction {
    (map : any, options? : any): any;
}

interface ProjectMigrationFunction {
    async () : Promise<void>;
}

interface VersionFile {
    projectVersion : MapVersion,
    editorVersion : string,
    mapMigrations : MapMigration[]
}

const DEFAULT_VERSION_FILE : VersionFile = {
    projectVersion : "1.0",
    editorVersion : EDITOR_VERSION,
    mapMigrations : []
}
