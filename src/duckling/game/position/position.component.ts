import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

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
        <dk-form-label title="Position"></dk-form-label>
        <dk-vector-input
            [value]="attribute.position"
            (validInput)="onPositionInput($event)">
        </dk-vector-input>
        <dk-form-label title="Velocity"></dk-form-label>
        <dk-vector-input
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
