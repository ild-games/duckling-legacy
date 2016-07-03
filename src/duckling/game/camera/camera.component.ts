import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

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
    template: `
        This entity is a camera
    `
})
export class CameraComponent {

    @Input() attribute : CameraAttribute;

    @Output() attributeChanged = new EventEmitter<CameraAttribute>();
}
