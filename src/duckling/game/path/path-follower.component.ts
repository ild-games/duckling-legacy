import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {immutableAssign} from '../../util/model';
import {Vector} from '../../math/vector';
import {EntityKey} from '../../entitysystem/entity';

import {PathFollowerAttribute} from './path-follower-attribute';

@Component({
    selector: "dk-path-follower",
    template: `
        <dk-input
            label="Path Entity"
            [value]="attribute.pathEntity"
            (inputChanged)="onPathEntityChanged($event)">
        </dk-input>
    `
})
export class PathFollowerComponent {
    @Input() attribute : PathFollowerAttribute;
    @Output() attributeChanged = new EventEmitter<PathFollowerAttribute>();

    onPathEntityChanged(newPathEntity : EntityKey) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {pathEntity: newPathEntity}));
    }
}