import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {NumberInput} from '../../controls';
import {immutableAssign} from '../../util';

import {RotateAttribute} from './rotate-attribute';

@Component({
    selector: "dk-rotate-component",
    template: `
        <dk-number-input
            label="Speed"
            [value]="attribute.speed"
            (validInput)="onSpeedInput($event)">
        </dk-number-input>
    `
})
export class RotateComponent {
    @Input() attribute : RotateAttribute;
    @Output() attributeChanged = new EventEmitter<RotateAttribute>();

    onSpeedInput(newSpeed : number) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {speed: newSpeed}))
    }
}
