import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {VectorInput, FormLabel} from '../../controls';
import {immutableAssign} from '../../util';
import {Vector} from '../../math';

import {Rectangle} from './rectangle';

/**
 * Component used to edit a Rectangle shape
 */
@Component({
    selector: "dk-rectangle-component",
    directives: [VectorInput],
    template: `
        <dk-vector-input
            xLabel="Width"
            yLabel="Height"
            [value]="rectangle.dimension"
            (validInput)="onDimensionInput($event)">
        </dk-vector-input>
    `
})
export class RectangleComponent {
    @Input() rectangle : Rectangle;
    @Output() rectangleChanged = new EventEmitter<Rectangle>();

    onDimensionInput(newDimension : Vector) {
        this.rectangleChanged.emit(immutableAssign(this.rectangle, {dimension: newDimension}));
    }
}
