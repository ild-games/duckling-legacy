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

@NgModule({
    providers: [
        AttributeDefaultService,
        AvailableAttributeService,
        EntityBoxService,
        EntityPositionService,
        EntitySelectionService,
        EntityLayerService,
        BaseAttributeService,
        EntitySystemService
    ]
})
export class EntitySystemModule {

}
