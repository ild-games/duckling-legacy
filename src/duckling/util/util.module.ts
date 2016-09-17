import {NgModule} from '@angular/core';

import {
    DialogService,
    JsonLoaderService,
    PathService,
    WindowService
} from './index';

@NgModule({
    providers: [
        DialogService,
        JsonLoaderService,
        PathService,
        WindowService
    ]
})
export class UtilModule {

}
