import {Component} from 'angular2/core';
import {Entity} from '../entitysystem/entity';
import {EntityComponent} from '../entitysystem/entity.component';

@Component({
    selector: 'duckling-shell',
    directives: [EntityComponent],
    template: `
        <h1>This is the Shell</h1>
        <entity-component
            [entity]="entity"
            (entityChanged)="onEntityChanged($event)">
        </entity-component>
    `
})
export class ShellComponent {
    entity : Entity = {
        position : {
            position: { x: 0, y: 0},
            velocity: { x: 0, y: 0}
        }
    }

    onEntityChanged(entity : Entity) {
        this.entity = entity;
    }
}
