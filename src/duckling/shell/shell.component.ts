import {Component, Input, ChangeDetectorRef} from 'angular2/core';
import {Entity} from '../entitysystem/entity';
import {EntityComponent} from '../entitysystem/entity.component';
import {MapEditorComponent} from '../canvas/map-editor.component';
import {NumberInput} from '../controls/number-input.component';

import {BodyType, CollisionType} from '../game/collision/collision-attribute';

@Component({
    selector: 'duckling-shell',
    directives: [EntityComponent, MapEditorComponent],
    template: `
        <h1>This is the Shell</h1>
        <dk-map-editor>
        </dk-map-editor>
    `
})
export class ShellComponent {
}
