import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

import {PositionAttribute} from './position-attribute';
import {VectorInput} from '../../controls/vector-input.component';
import {Vector} from '../../math/vector';

@Component({
    selector: "position-component",
    directives: [VectorInput],
    template: `
        <vector-input
            labelPrefix="Position"
            [value]="attribute.position"
            (validInput)="onPositionInput($event)">
        </vector-input>
        <br />
        <vector-input
            labelPrefix="Velocity"
            [value]="attribute.velocity"
            (validInput)="onVelocityInput($event)">
        </vector-input>
    `
})
export class PositionComponent {

    @Input() attribute : PositionAttribute;

    @Output() attributeChanged: EventEmitter<PositionAttribute> = new EventEmitter();

    onPositionInput(position : Vector) {
        this.attributeChanged.emit(Object.assign(this.attribute, {position}));
    }

    onVelocityInput(velocity : Vector) {
        this.attributeChanged.emit(Object.assign(this.attribute, {velocity}));
    }
}
