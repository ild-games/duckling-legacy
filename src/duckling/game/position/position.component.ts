import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {PositionAttribute} from './position-attribute';
import {VectorInput, FormLabel} from '../../controls';
import {Vector} from '../../math/vector';
import {immutableAssign} from '../../util/model';

/**
 * Implementation that will be registered with the AttributeComponentService.
 * @see AttributeComponentService
 * @see AttributeComponent
 */
@Component({
    selector: "position-component",
    directives: [VectorInput, FormLabel],
    styleUrls: ['./duckling/game/position/position.component.css'],
    template: `
        <dk-vector-input
            xLabel="Position X"
            yLabel="Position Y"
            [value]="attribute.position"
            (validInput)="onPositionInput($event)">
        </dk-vector-input>
        <dk-vector-input
            xLabel="Velocity X"
            yLabel="Velocity Y"
            [value]="attribute.velocity"
            (validInput)="onVelocityInput($event)">
        </dk-vector-input>
    `
})
export class PositionComponent {

    @Input() attribute : PositionAttribute;

    @Output() attributeChanged = new EventEmitter<PositionAttribute>();

    onPositionInput(position : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {position}));
    }

    onVelocityInput(velocity : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {velocity}));
    }
}
