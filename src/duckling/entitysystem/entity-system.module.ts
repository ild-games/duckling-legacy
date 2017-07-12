import {NgModule} from '@angular/core';

import {ControlsModule} from '../controls/controls.module';
import {
    AttributeDefaultService,
    AvailableAttributeService,
    EntityBoxService,
    EntityPositionService,
    BaseAttributeService,
    EntitySystemService,
    EntityLayerService
} from './index';
import {LayerDialogComponent} from './services/layer-dialog.component';

@NgModule({
    providers: [
        AttributeDefaultService,
        AvailableAttributeService,
        EntityBoxService,
        EntityPositionService,
        EntityLayerService,
        BaseAttributeService,
        EntitySystemService
    ],
    imports: [
        ControlsModule
    ],
    declarations: [
        LayerDialogComponent
    ],
    exports: [
        LayerDialogComponent
    ],
    entryComponents: [
        LayerDialogComponent
    ]
})
export class EntitySystemModule {

}
