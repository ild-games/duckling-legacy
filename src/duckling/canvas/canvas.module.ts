import { NgModule } from "@angular/core";

import { ControlsModule } from "../controls";
import {
  BottomToolbarComponent,
  CanvasScaleComponent,
  TopToolbarComponent
} from "./_toolbars";
import { CanvasComponent } from "./canvas.component";
import { MapEditorComponent } from "./map-editor.component";
import { EntityDrawerService } from "./drawing";
import {
  ToolService,
  EntityCreatorTool,
  EntityMoveTool,
  MapMoveTool
} from "./tools";
import { SelectedEntityTool } from "./tools/selected-entity-tool";
import { EntityResizeTool } from "./tools/resize-tool";
import { SnapToGridService } from "./tools/grid-snap.service";

@NgModule({
  imports: [ControlsModule],
  declarations: [
    BottomToolbarComponent,
    CanvasScaleComponent,
    TopToolbarComponent,
    CanvasComponent,
    MapEditorComponent
  ],
  exports: [CanvasComponent, MapEditorComponent],
  providers: [
    EntityDrawerService,
    ToolService,
    EntityCreatorTool,
    EntityMoveTool,
    MapMoveTool,
    SelectedEntityTool,
    EntityResizeTool,
    SnapToGridService
  ]
})
export class CanvasModule {}
