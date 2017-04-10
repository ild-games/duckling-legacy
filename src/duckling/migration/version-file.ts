import {MapVersion} from '../util/version';

import {MapMigration} from './map-migration';

export interface VersionFile {
    projectVersion : MapVersion,
    editorVersion : string,
    mapMigrations : MapMigration[]
}

export function initialVersionFile(editorVersion : string) : VersionFile {
    return {
        projectVersion : "1.0",
        editorVersion,
        mapMigrations : []
    }
}
