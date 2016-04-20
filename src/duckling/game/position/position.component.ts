import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

import {PositionAttribute} from './position-attribute';
import {VectorInput} from '../../controls/vector-input.component';
import {Vector} from '../../math/vector';
import {immutableAssign} from '../../util/model';

/**
 * Implementation that will be registered with the AttributeComponentService.
 * @see AttributeComponentService
 * @see AttributeComponent
 */
@Component({
    selector: "position-component",
    directives: [VectorInput],
    styleUrls: ['build/game/position/position.component.css']
    template: `
        <dk-vector-input
            title="Position"
            [value]="attribute.position"
            (validInput)="onPositionInput($event)">
        </dk-vector-input>
        <dk-vector-input
            title="Velocity"
            [value]="attribute.velocity"
            (validInput)="onVelocityInput($event)">
        </dk-vector-input>
    `
})
export class PositionComponent {

    @Input() attribute : PositionAttribute;

    @Output() attributeChanged: EventEmitter<PositionAttribute> = new EventEmitter();

    onPositionInput(position : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {position}));
    }

    onVelocityInput(velocity : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {velocity}));
    }
}
