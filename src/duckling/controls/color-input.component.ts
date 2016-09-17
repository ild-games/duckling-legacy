import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {immutableAssign} from '../util';

import {ValidatedInput} from './validated-input.component';

import {Color} from '../canvas/drawing/color';

/**
 * Component for displaying and editing a Color object
 */
@Component({
    selector: "dk-color-component",

    styleUrls: ['./duckling/controls/color-input.component.css'],
    template:`
        <dk-validated-input
            label="Color R"
            [value]="color.r"
            [validator]="isRGBAValue"
            (validInput)="onColorRInput($event)">
        </dk-validated-input>
        <dk-validated-input
            label="Color G"
            [value]="color.g"
            [validator]="isRGBAValue"
            (validInput)="onColorGInput($event)">
        </dk-validated-input>
        <dk-validated-input
            label="Color B"
            [value]="color.b"
            [validator]="isRGBAValue"
            (validInput)="onColorBInput($event)">
        </dk-validated-input>
        <dk-validated-input
            label="Color A"
            [value]="color.a"
            [validator]="isRGBAValue"
            (validInput)="onColorAInput($event)">
        </dk-validated-input>
    `
})
export class ColorInput {
    @Input() color : Color;
    @Output() colorChanged = new EventEmitter<Color>();

    onColorRInput(newR : string) {
        this.colorChanged.emit(immutableAssign(this.color, {r: +newR}));
    }

    onColorGInput(newG : string) {
        this.colorChanged.emit(immutableAssign(this.color, {g: +newG}));
    }

    onColorBInput(newB : string) {
        this.colorChanged.emit(immutableAssign(this.color, {b: +newB}));
    }

    onColorAInput(newA : string) {
        this.colorChanged.emit(immutableAssign(this.color, {a: +newA}));
    }

    isRGBAValue(value : string) {
        var number = Number.parseInt(value);
        return number >= 0 && number <= 255;
    }
}
