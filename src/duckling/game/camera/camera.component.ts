import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MdCheckbox} from '@angular2-material/checkbox';

import {CameraAttribute} from './camera-attribute';
import {VectorInput} from '../../controls/vector-input.component';
import {Vector} from '../../math/vector';
import {immutableAssign} from '../../util/model';

/**
 * Implementation that will be registered with the AttributeComponentService.
 * @see AttributeComponentService
 * @see AttributeComponent
 */
@Component({
    selector: "dk-attribute-component",
    styleUrls: ['./duckling/game/camera/camera.component.css'],
    directives: [MdCheckbox],
    template: `
        <md-checkbox
            class="form-label"
            [checked]="attribute.default"
            (change)="onDefaultPressed($event.checked)">
            Default?
        </md-checkbox>
    `
})
export class CameraComponent {

    @Input() attribute : CameraAttribute;

    @Output() attributeChanged = new EventEmitter<CameraAttribute>();

    onDefaultPressed(newDefault : boolean) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {default: newDefault}));
    }
}
