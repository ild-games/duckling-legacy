import {NgModule} from '@angular/core';

import {ControlsModule} from "../controls";
import {BottomToolbarComponent, CanvasScaleComponent, TopToolbarComponent} from './_toolbars';
import {Canvas} from './canvas.component';
import {MapEditorComponent} from './map-editor.component';
import {EntityDrawerService, RenderPriorityService} from './drawing';
import {ToolService, EntityCreatorTool, EntityMoveTool, MapMoveTool} from './tools';

@NgModule({
    imports: [
        ControlsModule
    ],
    declarations: [
        BottomToolbarComponent,
        CanvasScaleComponent,
        TopToolbarComponent,
        Canvas,
        MapEditorComponent
    ],
    exports: [
        Canvas,
        MapEditorComponent
    ],
    providers : [
        EntityDrawerService,
        ToolService,
        EntityCreatorTool,
        EntityMoveTool,
        MapMoveTool
    ]
})
export class CanvasModule {

}
