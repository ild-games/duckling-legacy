import {NgModule} from '@angular/core';

import {ControlsModule} from '../controls/controls.module';
import {
    AttributeDefaultService,
    AvailableAttributeService,
    EntityBoxService,
    EntityPositionService,
    EntitySelectionService,
    BaseAttributeService,
    EntitySystemService,
    EntityLayerService
} from './index';
import {LayerDialogComponent} from './services/layer-dialog.component';
import {CollisionTypesService} from './services/collision-types.service';

@NgModule({
    providers: [
        AttributeDefaultService,
        AvailableAttributeService,
        EntityBoxService,
        EntityPositionService,
        EntitySelectionService,
        EntityLayerService,
        BaseAttributeService,
        EntitySystemService,
        CollisionTypesService
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
