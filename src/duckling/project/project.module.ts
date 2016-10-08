import {NgModule} from '@angular/core';

import {
    AssetService,
    MapParserService,
    ProjectService,
    RequiredAssetService
} from './index';
import {MapSelectComponent} from './map-select.component';
import {BrowseAssetComponent} from './browse-asset.component';

import {ControlsModule} from '../controls';

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
