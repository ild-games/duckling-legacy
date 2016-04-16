import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

import {Vector} from '../math/vector';
import {NumberInput} from './number-input.component';

@Component({
    selector: "vector-input",
    directives: [NumberInput],
    styles: [`
        .vectorLabel {
            color: black;
            padding-bottom: 5px;
        }
    `],
    template:`
        <div>
            <div class="vectorLabel">{{labelPrefix}}</div>
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
    @Input() labelPrefix : string;
    @Input() value : Vector;

    @Output() validInput : EventEmitter<Vector> = new EventEmitter();

    onXInput(x : number) {
        this.validInput.emit(Object.assign(this.value, {x}));
    }

    onYInput(y : number) {
        this.validInput.emit(Object.assign(this.value, {y}));
    }
}
