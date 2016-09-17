import {NgModule} from '@angular/core';

import {
    JsonLoaderService,
    PathService,
} from './index';

@NgModule({
    providers: [
        JsonLoaderService,
        PathService
    ]
})
export class UtilModule {

}
