import {NgModule} from '@angular/core';

import {
    AssetService,
    MapParserService,
    ProjectService,
    RequiredAssetService
} from './index';

@NgModule({
    providers: [
        AssetService,
        MapParserService,
        ProjectService,
        RequiredAssetService
    ]
})
export class ProjectModule {

}
