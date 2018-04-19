import {NgModule} from '@angular/core';

import {JsonLoaderService} from './json-loader.service';
import {PathService} from './path.service';
import {KeyboardService} from './keyboard.service';
import {MouseService} from './mouse.service';

@NgModule({
    providers: [
        JsonLoaderService,
        PathService,
        KeyboardService,
        MouseService
    ]
})
export class UtilModule {
}
