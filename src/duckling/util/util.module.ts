import {NgModule} from '@angular/core';

import {
    JsonLoaderService,
    PathService,
    KeyboardService
} from './index';

@NgModule({
    providers: [
        JsonLoaderService,
        PathService,
        KeyboardService
    ]
})
export class UtilModule {

}
