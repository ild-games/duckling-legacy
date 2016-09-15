import {NgModule} from '@angular/core';

import {ControlsModule} from '../controls/controls.module.ts';
import {
    AttributeDefaultService,
    AvailableAttributeService,
    EntityBoxService,
    EntityPositionSetService,
    EntitySelectionService,
    BaseAttributeService,
    EntitySystemService
} from './index';

@NgModule({
    providers: [
        AttributeDefaultService,
        AvailableAttributeService,
        EntityBoxService,
        EntityPositionSetService,
        EntitySelectionService,
        BaseAttributeService,
        EntitySystemService
    ]
})
export class EntitySystemModule {

}
