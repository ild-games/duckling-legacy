import {MapMigration} from './map-migration';
import {MigrationTools} from './migration-tools';
import {Attribute} from './map-format';
import {MapMigrationFunction} from './migration.service';

export interface EditorMigration {
    function: (tools : MigrationTools) => MapMigrationFunction;
    updateEditorVersion: string;
}

export let editorMigrations : EditorMigration[] = [
    {
        updateEditorVersion: "0.2",
        function: function(tools : any) {
            return tools.attributeMigration("drawable", function (attribute : any) {
                delete attribute.topDrawable.positionOffset;
                return {
                    topDrawable: {
                        ...attribute.topDrawable,
                        anchor: {x: 0.5, y: 0.5}
                    }
                }
            });
        }
    },
    {
        updateEditorVersion: "0.3",
        function: function(tools : any) {
            return tools.attributeMigration("collision", function (attribute : any) {
                return {
                    ...attribute,
                    anchor: {x: 0.5, y: 0.5}
                }
            });
        }
    }
];

