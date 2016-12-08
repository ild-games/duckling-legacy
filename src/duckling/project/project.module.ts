import {NgModule} from '@angular/core';

import {
    AssetService,
    MapParserService,
    ProjectService,
    RequiredAssetService
} from './index';
import {MapSelectComponent} from './map-select.component';
import {BrowseAssetComponent} from './browse-asset.component';
import {MapDimensionService} from './map-dimension.service';

import {ControlsModule} from '../controls/controls.module';

@NgModule({
    imports: [
        ControlsModule
    ],
    providers: [
        AssetService,
        MapParserService,
        ProjectService,
        RequiredAssetService,
        MapDimensionService
    ],
    declarations: [
        MapSelectComponent,
        BrowseAssetComponent
    ],
    exports: [
        BrowseAssetComponent
    ],
    entryComponents: [
        MapSelectComponent
    ]
})
export class ProjectModule {

}
