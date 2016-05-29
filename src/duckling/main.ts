import {
    Provider,
    Type
} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {remote} from 'electron';

import {ShellComponent} from './shell/shell.component';
import {EntityDrawerService} from './canvas/drawing/entity-drawer.service';

import {
    AttributeComponentService,
    AttributeDefaultService,
    EntityBoxService,
    EntitySystemService,
    EntityPositionSetService,
    EntitySelectionService,
    entitySystemReducer,
    mergeEntityAction,
    createEntitySystem
} from './entitysystem';

import {
    EntityCreatorTool,
    ToolService
} from './canvas/tools';

import {Action, StoreService} from './state';
import {mainReducer} from './main.reducer';

import {projectReducer, ProjectService, MapParserService} from './project';

import {bootstrapGameComponents} from './game/index';
import {ProjectSerializerService} from './splash/project-serializer.service';
import {DialogService} from './util/dialog.service';
import {JsonLoaderService} from './util/json-loader.service';
import {PathService} from './util/path.service';
import {WindowService} from './util/window.service';
import {ElectronDialogService} from '../electron/util/electron-dialog.service';
import {ElectronWindowService} from '../electron/util/electron-window.service';

remote.getCurrentWindow().removeAllListeners();

var storeService = new StoreService(mainReducer, mergeEntityAction);
var entitySystemService = new EntitySystemService(storeService);

// Bootstrap game specific behavior
var attributeComponentService = new AttributeComponentService();
var entityDrawerService = new EntityDrawerService();
var entityBoxService = new EntityBoxService();
var attributeDefaultService = new AttributeDefaultService();
var entityPositionSetService = new EntityPositionSetService(entitySystemService);
var entityCreatorTool = new EntityCreatorTool(attributeDefaultService, entitySystemService, entityPositionSetService);

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
    entityPositionSetService
});

function provideInstance(instance : any, base : Type) {
    return new Provider(base, {useValue : instance});
}
function provideClass(implementationClass : Type, base : Type) {
    return new Provider(base, {useClass : implementationClass});
}
bootstrap(ShellComponent, [
    provideInstance(storeService, StoreService),
    provideInstance(attributeComponentService, AttributeComponentService),
    provideInstance(entityDrawerService, EntityDrawerService),
    provideInstance(entityBoxService, EntityBoxService),
    provideInstance(attributeDefaultService, AttributeDefaultService),
    provideInstance(entityPositionSetService, EntityPositionSetService),
    provideInstance(entitySystemService, EntitySystemService),
    provideInstance(entityCreatorTool, EntityCreatorTool),
    provideClass(ElectronDialogService, DialogService),
    provideClass(ElectronWindowService, WindowService),
    EntitySelectionService,
    JsonLoaderService,
    PathService,
    ProjectSerializerService,
    ProjectService,
    MapParserService
]);
