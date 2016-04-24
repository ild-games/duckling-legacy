import {Provider} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ShellComponent} from './shell/shell.component';
import {EntityDrawerService} from './canvas/drawing/entity-drawer.service';
import {AttributeComponentService} from './entitysystem/attribute-component.service';
import {EntitySystemService} from './entitysystem/entity-system.service';
import {bootstrapGameComponents} from './game/index';

var componentService = new AttributeComponentService();
var drawerService = new EntityDrawerService();

/**
 * Eventually we want to support multiple different games.  This means any component specific
 * behavior needs to be loosely coupled. This function will register component specific implementations
 * will the relevant services.
 */
bootstrapGameComponents(
    componentService,
    drawerService
);

function provide(instance : any, base : any) {
    return new Provider(base, {useValue : instance});
}

bootstrap(ShellComponent, [
    provide(componentService, AttributeComponentService),
    provide(drawerService, EntityDrawerService),
    EntitySystemService
]);
