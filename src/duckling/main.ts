import {
    NgModule,
    ApplicationRef,
    Provider,
    Type
} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {remote} from 'electron';
import {SCALE_MODES} from 'pixi.js';

import {EntityDrawerService} from './canvas/drawing/entity-drawer.service';
import {RenderPriorityService} from './canvas/drawing/render-priority.service';

import {AngularMaterialModule} from './angular-material-all';
import {CanvasModule} from './canvas/canvas.module';
import {ControlsModule} from './controls';
import {EntityEditorModule} from './entityeditor';
import {EntitySystemModule, mergeEntityAction} from './entitysystem';
import {GameModule} from './game/game.module';
import {StoreService, StateModule} from './state';
import {ProjectModule} from './project';
import {SelectionModule} from './selection';
import {ShellComponent, ShellModule} from './shell'
import {SplashModule} from './splash';
import {mainReducer} from './main.reducer';
import {DialogService, WindowService, UtilModule} from './util';
import {ElectronDialogService} from '../electron/util/electron-dialog.service';
import {ElectronWindowService} from '../electron/util/electron-window.service';

remote.getCurrentWindow().removeAllListeners();

let storeService = new StoreService(mainReducer, mergeEntityAction);

// Setup window defaults
let electronWindowService = new ElectronWindowService();


function provideInstance(instance : any, base : Type) {
    return new Provider(base, {useValue : instance});
}
function provideClass(implementationClass : Type, base : Type) {
    return new Provider(base, {useClass : implementationClass});
}

@NgModule({
    imports: [
        BrowserModule,
        CanvasModule,
        ControlsModule,
        EntityEditorModule,
        EntitySystemModule,
        GameModule,
        ProjectModule,
        SelectionModule,
        ShellModule,
        SplashModule,
        StateModule,
        UtilModule
    ],
    providers: [
        provideInstance(storeService, StoreService),
        provideClass(ElectronWindowService, WindowService),
        provideClass(ElectronDialogService, DialogService),
    ],
    entryComponents: [
        ShellComponent
    ]
})
export class DucklingAppModule {
    constructor(private _appRef : ApplicationRef) {
    }

    ngDoBootstrap() {
        this._appRef.bootstrap(ShellComponent);
    }
}

platformBrowserDynamic().bootstrapModule(DucklingAppModule);

// set pixi.js to use nearest neighbor scaling method as a default
SCALE_MODES.DEFAULT = SCALE_MODES.NEAREST;
