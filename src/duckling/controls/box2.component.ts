import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {Box2, Vector} from '../math';
import {immutableAssign} from '../util';

import {VectorInputComponent} from './vector-input.component';
import {Validator} from './validated-input.component';

/**
 * Implementation that will be registered with the AttributeComponentService.
 * @see AttributeComponentService
 * @see AttributeComponent
 */
@Component({
    selector: "dk-box2",
    styleUrls: ['./duckling/controls/box2.component.css'],
    template: `
        <dk-vector-input
            xLabel="Starting X"
            yLabel="Starting Y"
            [value]="value.position"
            [xValidator]="xValidator"
            [yValidator]="yValidator"
            (validInput)="onPositionChanged($event)">
        </dk-vector-input>
        <dk-vector-input
            xLabel="Width"
            yLabel="Height"
            [value]="value.dimension"
            [xValidator]="widthValidator"
            [yValidator]="heightValidator"
            (validInput)="onDimensionChanged($event)">
        </dk-vector-input>
    `
})
export class Box2Component {
    @Input() value : Box2;
    @Input() xValidator : Validator;
    @Input() yValidator : Validator;
    @Input() widthValidator : Validator;
    @Input() heightValidator : Validator;
    @Output() boxChanged = new EventEmitter<Box2>();

    onPositionChanged(newPosition : Vector) {
        this.boxChanged.emit(immutableAssign(this.value, {position: newPosition}));
    }

    onDimensionChanged(newDimension : Vector) {
        this.boxChanged.emit(immutableAssign(this.value, {dimension: newDimension}));
    }
}
