import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

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
        <table>
            <tr>
                <td>
                    <dk-number-input
                        [label]="xLabel"
                        [value]="value.x"
                        (validInput)="onXInput($event)">
                    </dk-number-input>
                </td>
                <td>
                    <dk-number-input
                        [label]="yLabel"
                        [value]="value.y"
                        (validInput)="onYInput($event)">
                    </dk-number-input>
                </td>
            </tr>
        </table>
    `
})
export class VectorInput {
    @Input() xLabel : string = "X";
    @Input() yLabel : string = "Y";
    @Input() value : Vector;

    /**
     * Event published when the user enters a valid input.
     */
    @Output() validInput = new EventEmitter<Vector>();

    onXInput(x : number) {
        this.validInput.emit(immutableAssign(this.value, {x}));
    }

    onYInput(y : number) {
        this.validInput.emit(immutableAssign(this.value, {y}));
    }
}
