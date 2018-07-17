import { MapMigration } from "./map-migration";
import { MigrationTools } from "./migration-tools";
import { Attribute } from "./map-format";
import { MapMigrationFunction } from "./migration.service";

export interface EditorMigration {
  function: (tools: MigrationTools) => MapMigrationFunction;
  updateEditorVersion: string;
}

export let editorMigrations: EditorMigration[] = [
  {
    updateEditorVersion: "0.2",
    function: function(tools: any) {
      return tools.attributeMigration("drawable", function(attribute: any) {
        function processDrawable(drawable: any): any {
          delete drawable.positionOffset;
          let anchorPoint = { x: 0.5, y: 0.5 };
          if (drawable.__cpp_type === "ild::ContainerDrawable") {
            let drawables: any[] = [];
            for (let child of drawable.drawables) {
              drawables.push(processDrawable(child));
            }
            drawable.drawables = drawables;
            anchorPoint = { x: 0, y: 0 };
          } else if (drawable.__cpp_type === "ild::AnimatedDrawable") {
            let frames: any[] = [];
            for (let frame of drawable.frames) {
              frames.push(processDrawable(frame));
            }
            drawable.frames = frames;
            anchorPoint = { x: 0, y: 0 };
          }
          return {
            ...drawable,
            anchor: anchorPoint
          };
        }

        if (attribute.topDrawable) {
          attribute.topDrawable = processDrawable(attribute.topDrawable);
        }
        return attribute;
      });
    }
  },
  {
    updateEditorVersion: "0.3",
    function: function(tools: any) {
      return function(map: any) {
        let migration = tools.entityMigration(function(entity: any) {
          if (entity.position && entity.position.position && map.dimension) {
            entity.position.position.x += map.dimension.x / 2;
            entity.position.position.y += map.dimension.y / 2;
          }
          return entity;
        });
        return migration(map);
      };
    }
  },
  {
    updateEditorVersion: "0.4",
    function: function(tools: any) {
      return tools.attributeMigration("collision", function(attribute: any) {
        return {
          ...attribute,
          anchor: { x: 0.5, y: 0.5 }
        };
      });
    }
  }
];
