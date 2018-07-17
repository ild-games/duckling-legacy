import { NgModule } from "@angular/core";

import { ControlsModule } from "../controls/controls.module";
import {
  AttributeComponent,
  AttributeComponentService,
  AttributeSelectorComponent,
  EntityEditorComponent,
  EntityComponent
} from "./index";
import { EntityNameComponent } from "./_entity-name.component";
import { DefaultAttributeComponent } from "./_default-attribute.component";

@NgModule({
  imports: [ControlsModule],
  declarations: [
    AttributeComponent,
    AttributeSelectorComponent,
    EntityEditorComponent,
    EntityComponent,
    EntityNameComponent,
    DefaultAttributeComponent
  ],
  exports: [
    AttributeComponent,
    AttributeSelectorComponent,
    EntityEditorComponent
  ],
  providers: [AttributeComponentService],
  entryComponents: [DefaultAttributeComponent]
})
export class EntityEditorModule {}
