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

import {ShellComponent} from './shell/shell.component';
import {EntityDrawerService} from './canvas/drawing/entity-drawer.service';
import {RenderPriorityService} from './canvas/drawing/render-priority.service';
import {AngularMaterialModule} from './angular-material-all';
import {
    AttributeDefaultService,
    EntityBoxService,
    EntitySystemService,
    EntityPositionSetService,
    EntitySelectionService,
    entitySystemReducer,
    mergeEntityAction,
    createEntitySystem,
    AvailableAttributeService
} from './entitysystem';
import {AttributeComponentService} from './entityeditor';
import {EntityCreatorTool, ToolService} from './canvas/tools';
import {SelectionService, CopyPasteService} from './selection';
import {Action, StoreService} from './state';
import {mainReducer} from './main.reducer';
import {projectReducer, ProjectService, MapParserService, AssetService, RequiredAssetService} from './project';
import {bootstrapGameComponents} from './game/index';
import {ProjectSerializerService} from './splash/project-serializer.service';
import {DialogService} from './util/dialog.service';
import {JsonLoaderService} from './util/json-loader.service';
import {PathService} from './util/path.service';
import {WindowService} from './util/window.service';
import {ElectronDialogService} from '../electron/util/electron-dialog.service';
import {ElectronWindowService} from '../electron/util/electron-window.service';
import {AnconaSFMLRenderPriorityService} from './game/ancona-sfml-render-priority.service';

remote.getCurrentWindow().removeAllListeners();

let storeService = new StoreService(mainReducer, mergeEntityAction);
let entitySystemService = new EntitySystemService(storeService);
let assetService = new AssetService(storeService);
let requiredAssetService = new RequiredAssetService();

// Setup window defaults
let electronWindowService = new ElectronWindowService();

// Bootstrap game specific behavior
let attributeComponentService = new AttributeComponentService();
let anconaSFMLRenderPriorityService = new AnconaSFMLRenderPriorityService();
let entityDrawerService = new EntityDrawerService(assetService, requiredAssetService, anconaSFMLRenderPriorityService);
let entityBoxService = new EntityBoxService(assetService);
let attributeDefaultService = new AttributeDefaultService();
let entityPositionSetService = new EntityPositionSetService(entitySystemService);

/**
 * Eventually we want to support multiple different games.  This means any component specific
 * behavior needs to be loosely coupled. This function will register component specific implementations
 * will the relevant services.
 */
bootstrapGameComponents({
    attributeComponentService,
    entityDrawerService,
    entityBoxService,
    attributeDefaultService,
    entityPositionSetService,
    requiredAssetService
});

function provideInstance(instance : any, base : Type) {
    return new Provider(base, {useValue : instance});
}
function provideClass(implementationClass : Type, base : Type) {
    return new Provider(base, {useClass : implementationClass});
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AngularMaterialModule
    ],
    declarations: [
        ShellComponent
    ],
    providers: [
        provideInstance(storeService, StoreService),
        provideInstance(attributeComponentService, AttributeComponentService),
        provideInstance(entityDrawerService, EntityDrawerService),
        provideInstance(assetService, AssetService),
        provideInstance(requiredAssetService, RequiredAssetService),
        provideInstance(entityBoxService, EntityBoxService),
        provideInstance(attributeDefaultService, AttributeDefaultService),
        provideInstance(entityPositionSetService, EntityPositionSetService),
        provideInstance(entitySystemService, EntitySystemService),
        provideInstance(electronWindowService, WindowService),
        provideInstance(anconaSFMLRenderPriorityService, RenderPriorityService),
        provideClass(ElectronDialogService, DialogService),
        EntitySelectionService,
        JsonLoaderService,
        PathService,
        ProjectSerializerService,
        ProjectService,
        MapParserService,
        SelectionService,
        CopyPasteService,
        AvailableAttributeService,
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
