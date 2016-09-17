import {NgModule} from '@angular/core';

import {AngularMaterialModule} from '../angular-material-all';
import {ControlsModule} from '../controls'
import {SplashComponent} from './splash.component';
import {ProjectSerializerService} from './_project-serializer.service';

@NgModule({
    imports: [
        ControlsModule
    ],
    declarations: [
        SplashComponent
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
