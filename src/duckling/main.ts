import {Provider} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';

import {ShellComponent} from './shell/shell.component';
import {EntityDrawerService} from './canvas/drawing/entity-drawer.service';

import {
    AttributeComponentService,
    AttributeDefaultService,
    EntityBoxService,
    EntitySystemService,
    EntityPositionSetService,
    EntitySelectionService
} from './entitysystem';

import {
    EntityCreatorTool
} from './canvas/tools';

import {bootstrapGameComponents} from './game/index';
import {JsonLoaderService} from './util/json-loader.service';
import {PathService} from './util/path.service';
import {DialogService} from './util/dialog.service';


var entitySystemService = new EntitySystemService();

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

function provide(instance : any, base : any) {
    return new Provider(base, {useValue : instance});
}
bootstrap(ShellComponent, [
    provide(attributeComponentService, AttributeComponentService),
    provide(entityDrawerService, EntityDrawerService),
    provide(entityBoxService, EntityBoxService),
    provide(attributeDefaultService, AttributeDefaultService),
    provide(entityPositionSetService, EntityPositionSetService),
    provide(entitySystemService, EntitySystemService),
    provide(entityCreatorTool, EntityCreatorTool),
    EntitySelectionService,
    JsonLoaderService,
    PathService,
    DialogService
]);
