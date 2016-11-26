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
        EntitySizeService
    ]
})
export class EntitySystemModule {

}
