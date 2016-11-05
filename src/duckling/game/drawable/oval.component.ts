import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {NumberInputComponent} from '../../controls';
import {immutableAssign} from '../../util';

import {Oval} from './oval';

/**
 * Component used to edit a Oval shape
 */
@Component({
    selector: "dk-oval-drawable",
    template: `
        <dk-number-input
            label="Width Radius"
            [value]="oval.radiusWidth"
            (validInput)="onRadiusWidthInput($event)">
        </dk-number-input>
        <dk-number-input
            label="Height Radius"
            [value]="oval.radiusHeight"
            (validInput)="onRadiusHeightInput($event)">
        </dk-number-input>
    `
})
export class OvalComponent {
    @Input() oval : Oval;
    @Output() ovalChanged = new EventEmitter<Oval>();

    onRadiusWidthInput(newRadiusWidth : number) {
        this.ovalChanged.emit(immutableAssign(this.oval, {radiusWidth: newRadiusWidth}));
    }

    onRadiusHeightInput(newRadiusHeight : number) {
        this.ovalChanged.emit(immutableAssign(this.oval, {radiusHeight: newRadiusHeight}));
    }
}
