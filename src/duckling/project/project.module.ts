import { NgModule } from "@angular/core";

import {
  AssetService,
  MapParserService,
  ProjectService,
  RequiredAssetService
} from "./index";
import { SnackBarService } from "./snackbar.service";
import { MapSelectComponent } from "./map-select.component";
import { BrowseAssetComponent } from "./browse-asset.component";
import { ProjectLifecycleService } from "./project-lifecycle.service";
import { CustomAttributesComponent } from "./custom-attributes.component";
import { CustomAttributeComponent } from "./custom-attribute.component";

import { ControlsModule } from "../controls/controls.module";

@NgModule({
  imports: [ControlsModule],
  providers: [
    AssetService,
    MapParserService,
    ProjectService,
    RequiredAssetService,
    SnackBarService,
    ProjectLifecycleService
  ],
  declarations: [
    MapSelectComponent,
    BrowseAssetComponent,
    CustomAttributesComponent,
    CustomAttributeComponent
  ],
  exports: [BrowseAssetComponent],
  entryComponents: [
    MapSelectComponent,
    CustomAttributesComponent,
    CustomAttributeComponent
  ]
})
export class ProjectModule {}
