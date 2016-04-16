import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

import {ValidatedInput} from './validated-input.component';

var numberRegex=/^\-?[0-9]+(\.[0-9]+)?$/;

@Component({
    selector: "number-input",
    directives: [ValidatedInput],
    template:`
        <validated-input
            [label]="label"
            [value]="value"
            [validator]="isNumber"
            (validInput)="onInput($event)">
    `
})
export class NumberInput {
    @Input() label : string;
    @Input() value : number;

    @Output() validInput : EventEmitter<number> = new EventEmitter();

    onInput(value : string) {
        this.validInput.emit(parseFloat(value));
    }

    isNumber(value : string) {
        return value.match(numberRegex) !== null;
    }
}
