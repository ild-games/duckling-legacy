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
            <div class="vectorLabel">{{title}}</div>
            <number-input
                label="X"
                [value]="value.x"
                (validInput)="onXInput($event)">
            </number-input>
            <number-input
                label="Y"
                [value]="value.y"
                (validInput)="onYInput($event)">
            </number-input>
        </div>
    `
})
export class VectorInput {
    /**
     * Title describing the input to the user.
     */
    @Input() title : string;
    /**
     * The value stored in the control.
     */
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
