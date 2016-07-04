import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

import {VectorInput, NumberInput, FormLabel} from '../../controls';
import {Vector} from '../../math';
import {immutableAssign} from '../../util';

import {Drawable} from './drawable';

@Component({
    selector: "dk-generic-drawable-component",
    directives: [
        VectorInput,
        FormLabel,
        NumberInput,
        MD_INPUT_DIRECTIVES
    ],
    template: `
        <dk-form-label title="Scale"></dk-form-label>
        <dk-vector-input
            xLabel="X"
            yLabel="Y"
            [value]="drawable.scale"
            (validInput)="onScaleInput($event)">
        </dk-vector-input>

        <div>
            <dk-number-input
                label="Rotation"
                [value]="drawable.rotation"
                (validInput)="onRotationInput($event)">
            </dk-number-input>
        </div>

        <div>
            <md-input
                placeholder="Color"
                [value]="drawable.color"
                (input)="onColorInput($event.target.value)">
            </md-input>
        </div>
    `
})
export class GenericDrawableComponent {
    @Input() drawable : Drawable;
    @Output() drawableChanged = new EventEmitter<Drawable>();

    onScaleInput(newScale : Vector) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {scale: newScale}));
    }

    onRotationInput(newRotation : number) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {rotation: newRotation}));
    }

    onColorInput(newColor : number) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {color: newColor}));
    }
}
