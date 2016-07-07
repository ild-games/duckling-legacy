import {
    Provider,
    Type
} from '@angular/core';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {remote} from 'electron';

import {ShellComponent} from './shell/shell.component';
import {EntityDrawerService} from './canvas/drawing/entity-drawer.service';

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

import {
    AttributeComponentService
} from './entityeditor';

import {
    EntityCreatorTool,
    ToolService
} from './canvas/tools';

import {
    SelectionService,
    CopyPasteService
} from './selection';

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

// Setup window defaults
var electronWindowService = new ElectronWindowService();

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
    provideInstance(electronWindowService, WindowService),
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
    disableDeprecatedForms(),
    provideForms()
]);
