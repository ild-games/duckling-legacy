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
        <dk-number-input
            label="Render Priority"
            [value]="drawable.renderPriority"
            (validInput)="onRenderPriorityInput($event)">
        </dk-number-input>

        <dk-vector-input
            xLabel="Scale X"
            yLabel="Scale Y"
            [value]="drawable.scale"
            (validInput)="onScaleInput($event)">
        </dk-vector-input>

        <dk-number-input
            label="Rotation"
            [value]="drawable.rotation"
            (validInput)="onRotationInput($event)">
        </dk-number-input>
    `
})
export class GenericDrawableComponent {
    @Input() drawable : Drawable;
    @Output() drawableChanged = new EventEmitter<Drawable>();

    onRenderPriorityInput(newRenderPriority : number) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {renderPriority: newRenderPriority}));
    }

    onScaleInput(newScale : Vector) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {scale: newScale}));
    }

    onRotationInput(newRotation : number) {
        this.drawableChanged.emit(immutableAssign(this.drawable, {rotation: newRotation}));
    }
}
