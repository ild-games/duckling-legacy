import {Provider} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ShellComponent} from './shell/shell.component';
import {AttributeComponentService} from './entitysystem/attribute-component.service';
import {PositionComponent} from './game/position/position.component';

var instance = new AttributeComponentService();
instance.register("position", PositionComponent);
var componentService = new Provider(
    AttributeComponentService,
    {useValue : instance}
)

bootstrap(ShellComponent, [componentService]);
