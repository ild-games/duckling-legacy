import {NgModule} from '@angular/core';

import {EntityEditorModule} from '../entityeditor/entity-editor.module.ts';
import {CanvasModule} from '../canvas/canvas.module.ts';
import {SplashModule} from '../splash/splash.module.ts';
import {ShellComponent} from './shell.component';

@NgModule({
    imports: [
        EntityEditorModule,
        CanvasModule,
        SplashModule
    ],
    exports: [
        ShellComponent
    ]
})
export class ShellModule {

}
