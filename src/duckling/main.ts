import {Provider} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ShellComponent} from './shell/shell.component';
import {AttributeComponentService} from './entitysystem/attribute-component.service';
import {bootstrapGameComponents} from './game/index';
import {JsonLoaderService} from './util/json-loader.service';
import {PathService} from './util/path.service';


var instance = new AttributeComponentService();

/**
 * Eventually we want to support multiple different games.  This means any component specific
 * behavior needs to be loosely coupled. This function will register component specific implementations
 * will the relevant services.
 */
bootstrapGameComponents(instance);

var componentService = new Provider(
    AttributeComponentService,
    {useValue : instance}
)

bootstrap(
    ShellComponent,
    [
        componentService,
        JsonLoaderService,
        PathService
    ]);
