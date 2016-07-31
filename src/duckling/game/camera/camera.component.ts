import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MdCheckbox} from '@angular2-material/checkbox';

import {VectorInput, NumberInput} from '../../controls';
import {Vector} from '../../math/vector';
import {immutableAssign} from '../../util/model';

import {CameraAttribute} from './camera-attribute';

/**
 * Implementation that will be registered with the AttributeComponentService.
 * @see AttributeComponentService
 * @see AttributeComponent
 */
@Component({
    selector: "dk-camera-component",
    styleUrls: ['./duckling/game/camera/camera.component.css'],
    directives: [VectorInput, MdCheckbox, NumberInput],
    template: `
        <div class="default-checkbox">
            <md-checkbox
                [checked]="attribute.default"
                (change)="onDefaultPressed($event.checked)">
                Default?
            </md-checkbox>
        </div>

        <dk-vector-input
            xLabel="Size X"
            yLabel="Size Y"
            [value]="attribute.size"
            (validInput)="onSizeChanged($event)">
        </dk-vector-input>

        <dk-number-input
            label="Scale"
            [value]="attribute.scale"
            (validInput)="onScaleChanged($event)">
        </dk-number-input>
    `
})
export class CameraComponent {

    @Input() attribute : CameraAttribute;

    @Output() attributeChanged = new EventEmitter<CameraAttribute>();

    onDefaultPressed(newDefault : boolean) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {default: newDefault}));
    }

    onSizeChanged(newSize : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {size: newSize}));
    }

    onScaleChanged(newScale : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {scale: newScale}));
    }
}
