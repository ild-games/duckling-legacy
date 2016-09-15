import {NgModule} from '@angular/core';

import {AngularMaterialModule} from "../angular-material-all";
import {ControlsModule} from "../controls";
import {BottomToolbarComponent} from './_toolbars/bottom-toolbar.component';
import {CanvasScaleComponent} from './_toolbars/canvas-scale.component';
import {TopToolbarComponent} from './_toolbars/top-toolbar.component';
import {Canvas} from './canvas.component';
import {MapEditorComponent} from './map-editor.component';
import {EntityDrawerService, RenderPriorityService} from './drawing';

@NgModule({
    imports: [
        ControlsModule,
        AngularMaterialModule
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
        RenderPriorityService
    ]
})
export class CanvasModule {

}
