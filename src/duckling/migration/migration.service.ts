import {posix} from "path";
import {Injectable} from "@angular/core";

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

    async migrateMap<T>(map : T, versionInfo : ProjectVersionInfo, migrationRoot : string) : Promise<T> {
        let mapVersion = (map as any).version;

        if (versionCompareFunction(versionInfo.mapVersion, mapVersion) < 0) {
            throw new Error(`Map version ${mapVersion} is greater than the projects expected map version ${versionInfo.mapVersion}`);
        }

        let migrations = migrationsToRun(mapVersion, versionInfo.mapVersion, versionInfo.mapMigrations);

        let result : any = map;
        for (let migration of migrations) {
            result = this._getMigration(migration, migrationRoot)(result);
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
        //await let json = this._jsonLoader.getJsonFromPath(versionFileName);

        let versionFile : VersionFile;
        if (!rawFile) {
            versionFile = DEFAULT_VERSION_FILE;
            await this._jsonLoader.saveJsonToPath(versionFileName, JSON.stringify(DEFAULT_VERSION_FILE, null, 4));
        } else {
            versionFile = JSON.parse(rawFile);
        }


        return {
            mapMigrations : versionFile.mapMigrations,
            mapVersion : versionFile.projectVersion
        }
    }

    async migrateProject(projectPath : string) : Promise<any> {
        // run all project migrations
    }

    protected _getMigration(migration : MapMigration, migrationRoot : string) : MapMigrationFunction {
        switch (migration.type) {
            case "code":
                return this._loadMapMigration(migration, migrationRoot);
        }
    }

    private _loadMapMigration(migration : MapMigration, migrationRoot : string) : MapMigrationFunction {
        let fileName = this._path.join(migrationRoot, migration.name);
        let migrationModule = require(fileName);
        return migrationModule(new MigrationTools());
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
