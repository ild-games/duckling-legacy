import {NgModule} from '@angular/core';

import {ControlsModule} from '../controls/controls.module';
import {
    AttributeDefaultService,
    AvailableAttributeService,
    EntityBoxService,
    EntityPositionService,
    EntitySelectionService,
    BaseAttributeService,
    EntitySystemService
} from './index';

@NgModule({
    providers: [
        AttributeDefaultService,
        AvailableAttributeService,
        EntityBoxService,
        EntityPositionService,
        EntitySelectionService,
        BaseAttributeService,
        EntitySystemService
    ]
})
export class EntitySystemModule {

}
