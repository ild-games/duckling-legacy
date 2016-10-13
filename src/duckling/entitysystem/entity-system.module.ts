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
import {EntityEligibleResizeService} from './services/entity-eligible-resize.service';
import {EntitySizeService} from './services/entity-size.service';

@NgModule({
    providers: [
        AttributeDefaultService,
        AvailableAttributeService,
        EntityBoxService,
        EntityPositionService,
        EntitySelectionService,
        BaseAttributeService,
        EntitySystemService,
        EntityEligibleResizeService,
        EntitySizeService
    ]
})
export class EntitySystemModule {

}
