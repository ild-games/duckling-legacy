import {NgModule} from '@angular/core';

import {
    AssetService,
    MapParserService,
    ProjectService,
    RequiredAssetService
} from './index';
import {MapSelectComponent} from './map-select.component';
import {EditCollisionTypesComponent} from './edit-collision-types.component';
import {BrowseAssetComponent} from './browse-asset.component';

import {ControlsModule} from '../controls/controls.module';

@NgModule({
    imports: [
        ControlsModule
    ],
    providers: [
        AssetService,
        MapParserService,
        ProjectService,
        RequiredAssetService
    ],
    declarations: [
        MapSelectComponent,
        EditCollisionTypesComponent,
        BrowseAssetComponent
    ],
    exports: [
        BrowseAssetComponent
    ],
    entryComponents: [
        MapSelectComponent,
        EditCollisionTypesComponent
    ]
})
export class ProjectModule {

}
