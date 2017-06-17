import {MapMigration} from './map-migration';
import {MigrationTools} from './migration-tools';
import {Attribute} from './map-format';
import {MapMigrationFunction} from './migration.service';

export interface ExistingCodeMigration {
    rawMapFunction: (tools : MigrationTools) => MapMigrationFunction;
    entitySystemFunction: () => MapMigrationFunction;
    name: string;
}