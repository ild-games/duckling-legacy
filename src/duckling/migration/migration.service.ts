import { posix } from "path";
import { Injectable } from "@angular/core";

import { rethrow } from '../util/rethrow';
import { JsonLoaderService } from '../util/json-loader.service';
import { PathService } from '../util/path.service';
import { versionCompareFunction, MapVersion, EditorVersion, EDITOR_VERSION, incrementMajorVersion } from '../util/version';

import { EntitySystem } from '../entitysystem/entity';
import { migrationsToRun, MapMigration } from './map-migration';
import { MigrationTools } from './migration-tools';
import { EditorMigration, editorMigrations } from './editor-migration';
import { ExistingCodeMigration } from './existing-code-migration';

/**
* Used for registering migrations and duckling versions during the bootstrap process.
* During runtime it is used to load project migrations and providings all the logic
* for running migrations.
*/
@Injectable()
export class MigrationService {
    private _existingCodeMigrations: { [name: string]: ExistingCodeMigration } = {};

    constructor(
        private _path: PathService,
        private _jsonLoader: JsonLoaderService) {

    }

    registerExistingCodeMigration(existingCodeMigration: ExistingCodeMigration) {
        if (this._existingCodeMigrations[existingCodeMigration.name]) {
            throw new Error("Adding duplicate existing code migrations is not allowed.");
        }
        this._existingCodeMigrations[existingCodeMigration.name] = existingCodeMigration;
    }

    updateVersionFileWithExistingCodeMigration(versionFile: any, name: string, options?: any): any {
        versionFile.projectVersion = incrementMajorVersion(versionFile.projectVersion);
        versionFile.mapMigrations.push(
            {
                type: "existing-code",
                updateTo: versionFile.projectVersion,
                name,
                options
            }
        );
        return versionFile;
    }

    migrateEntitySystem(entitySystem: EntitySystem, migrationName: string, options?: any): EntitySystem {
        if (!this._existingCodeMigrations[migrationName]) {
            throw new Error(`Existing code migration "${migrationName}" has not been registered. See registerExistingCodeMigration.`);
        }
        let migrationFunction = this._existingCodeMigrations[migrationName].entitySystemFunction;
        return migrationFunction(entitySystem, options);
    }

    /**
     * Migrate a map to the newest version supported by the editor. Throws if the map is more advanced than the editor supports.
     */
    async migrateMap(map: any, versionInfo: ProjectVersionInfo, migrationRoot: string): Promise<any> {
        let mapVersion = (map as any).version;

        if (versionCompareFunction(versionInfo.mapVersion, mapVersion) < 0) {
            throw new Error(`Map version ${mapVersion} is greater than the projects expected map version ${versionInfo.mapVersion}`);
        }

        let migrations = migrationsToRun(mapVersion, versionInfo.mapVersion, versionInfo.mapMigrations);

        let result: any = map;
        for (let migration of migrations) {
            let mapMigration = this._getMigration(migration, migrationRoot);
            try {
                result = mapMigration(result, migration.options);
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
    async openProject(projectPath: string): Promise<ProjectVersionInfo> {
        let versionFileName = this._path.join(projectPath, "project", "version.json");
        let rawFile = await this._jsonLoader.getJsonFromPath(versionFileName);

        let versionFile: VersionFile;
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

        await this._addMissingEditorMigrations(versionFile, this._findMissingEditorMigrations(versionFile), versionFileName);

        return {
            mapMigrations: versionFile.mapMigrations,
            mapVersion: versionFile.projectVersion
        }
    }

    private async _addMissingEditorMigrations(versionFile: VersionFile, missingMigrations: EditorMigration[], versionFileName: string) {
        missingMigrations.sort((a, b) => versionCompareFunction(a.updateEditorVersion, b.updateEditorVersion));
        for (let migration of missingMigrations) {
            versionFile.projectVersion = incrementMajorVersion(versionFile.projectVersion);
            versionFile.mapMigrations.push({
                updateTo: versionFile.projectVersion,
                name: `${migration.updateEditorVersion}`,
                type: "editor-version"
            });
        }
        versionFile.editorVersion = EDITOR_VERSION;
        await this._jsonLoader.saveJsonToPath(versionFileName, JSON.stringify(versionFile, null, 4));
    }

    private _findMissingEditorMigrations(versionFile: VersionFile): EditorMigration[] {
        return editorMigrations.filter(migration => versionFile.editorVersion < migration.updateEditorVersion);
    }

    protected _getMigration(migration: MapMigration, migrationRoot: string): MapMigrationFunction {
        switch (migration.type) {
            case "code":
                return this._loadMapMigration(migration, migrationRoot);
            case "editor-version":
                return this._loadEditorVersionMigration(migration);
            case "existing-code":
                return this._loadExistingCodeMigration(migration);
        }
    }

    private _loadMapMigration(migration: MapMigration, migrationRoot: string): MapMigrationFunction {
        let fileName = this._path.join(migrationRoot, migration.name);
        let mapMigration: MapMigrationFunction;

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

    private _loadEditorVersionMigration(migration: MapMigration): MapMigrationFunction {
        for (let editorMigration of editorMigrations) {
            if (migration.name === editorMigration.updateEditorVersion) {
                return editorMigration.function(new MigrationTools());
            }
        }
        throw new Error(`Migration "${migration.name}" is not recognized by the editor.`);
    }

    private _loadExistingCodeMigration(migration: MapMigration): MapMigrationFunction {
        return this._existingCodeMigrations[migration.name].rawMapFunction(new MigrationTools());
    }
}

export interface ProjectVersionInfo {
    mapMigrations: MapMigration[],
    mapVersion: MapVersion
}

export interface MapMigrationFunction {
    (map: any, options?: any): any;
}

export interface EntitySystemMigrationFunction {
    (entitySystem: EntitySystem, options?: any): EntitySystem;
}

interface ProjectMigrationFunction {
    async(): Promise<void>;
}

interface VersionFile {
    projectVersion: MapVersion,
    editorVersion: string,
    mapMigrations: MapMigration[]
}

const DEFAULT_VERSION_FILE: VersionFile = {
    projectVersion: "1.0",
    editorVersion: EDITOR_VERSION,
    mapMigrations: []
}
