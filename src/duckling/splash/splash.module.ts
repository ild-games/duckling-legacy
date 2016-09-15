import {NgModule} from '@angular/core';

import {AngularMaterialModule} from '../angular-material-all';
import {ControlsModule} from '../controls'
import {SplashComponent} from './index';
import {ProjectSerializerService} from './_project-serializer.service';

@NgModule({
    imports: [

    ],
    exports: [
        SplashComponent
    ],
    providers: [
        ProjectSerializerService
    ]
})
export class SplashModule {

}
