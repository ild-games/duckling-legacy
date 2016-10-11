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
import {EntityResizeService} from './services/entity-resize.service';

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
        EntityResizeService
    ]
})
export class EntitySystemModule {

}
