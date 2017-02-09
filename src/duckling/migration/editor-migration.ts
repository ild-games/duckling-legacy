import {MapMigration} from './map-migration';
import {MigrationTools} from './migration-tools';
import {Attribute} from './map-format';
import {MapMigrationFunction} from './migration.service';

export interface EditorMigration {
    function: (tools : MigrationTools) => MapMigrationFunction;
    updateEditorVersion: string;
}

export let editorMigrations : EditorMigration[] = [
];

