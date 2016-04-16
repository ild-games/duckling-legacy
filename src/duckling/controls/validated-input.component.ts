import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

@Component({
    selector: "validated-input",
    directives: [MD_INPUT_DIRECTIVES],
    template:`
        <md-input
            [placeholder]="label"
            [value]="value"
            (input)="onUserInput($event.target.value)">
        </md-input>
    `
})
export class ValidatedInput {
    @Input() label : string;
    @Input() value : string;
    @Input() validator : (value:string) => string;

    @Output() validInput : EventEmitter<String> = new EventEmitter();

    onUserInput(newValue : string) {
        if (this.validator(newValue)) {
            this.validInput.emit(newValue);
        }
    }
}
