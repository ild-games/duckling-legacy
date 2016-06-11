import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

import {Vector} from '../math/vector';
import {immutableAssign} from '../util/model';
import {NumberInput} from './number-input.component';

/**
 * Component that allows a user to input values for a vector.
 */
@Component({
    selector: "dk-vector-input",
    directives: [NumberInput],
    styleUrls: ['./duckling/controls/vector-input.component.css'],
    template:`
        <div>
            <dk-number-input
                [label]="xLabel"
                [value]="value.x"
                (validInput)="onXInput($event)">
            </dk-number-input>
            <dk-number-input
                [label]="yLabel"
                [value]="value.y"
                (validInput)="onYInput($event)">
            </dk-number-input>
        </div>
    `
})
export class VectorInput {
    @Input() xLabel : string = "X";
    @Input() yLabel : string = "Y";
    @Input() value : Vector;

    /**
     * Event published when the user enters a valid input.
     */
    @Output() validInput : EventEmitter<Vector> = new EventEmitter();

    onXInput(x : number) {
        this.validInput.emit(immutableAssign(this.value, {x}));
    }

    onYInput(y : number) {
        this.validInput.emit(immutableAssign(this.value, {y}));
    }
}
