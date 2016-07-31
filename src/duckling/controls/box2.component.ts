import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {Box2, Vector} from '../math';
import {immutableAssign} from '../util';

import {VectorInput} from './vector-input.component';

/**
 * Implementation that will be registered with the AttributeComponentService.
 * @see AttributeComponentService
 * @see AttributeComponent
 */
@Component({
    selector: "dk-box2-component",
    directives: [VectorInput],
    styleUrls: ['./duckling/controls/box2.component.css'],
    template: `
        <dk-vector-input
            xLabel="Starting X"
            yLabel="Starting Y"
            [value]="value.position"
            (validInput)="onPositionChanged($event)">
        </dk-vector-input>
        <dk-vector-input
            xLabel="Width"
            yLabel="Height"
            [value]="value.dimension"
            (validInput)="onDimensionChanged($event)">
        </dk-vector-input>
    `
})
export class Box2Component {
    @Input() value : Box2;
    @Output() boxChanged = new EventEmitter<Box2>();

    onPositionChanged(newPosition : Vector) {
        this.boxChanged.emit(immutableAssign(this.value, {position: newPosition}));
    }

    onDimensionChanged(newDimension : Vector) {
        this.boxChanged.emit(immutableAssign(this.value, {dimension: newDimension}));
    }
}
