import {NgModule} from '@angular/core';

import {ControlsModule} from '../controls/controls.module.ts';
import {
    AttributeComponent,
    AttributeComponentService,
    EntityEditorComponent,
    EntityComponent
} from './index';
import {EntityNameComponent} from './_entity-name.component';

@NgModule({
    imports: [
        ControlsModule
    ],
    declarations: [
        AttributeComponent,
        AttributeComponentService,
        EntityEditorComponent,
        EntityComponent,
        EntityNameComponent
    ],
    exports: [
        AttributeComponent,
        EntityEditorComponent
    ],
    providers: [
        AttributeComponentService
    ]
})
export class EntityEditorModule {

}
