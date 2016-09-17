import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {immutableAssign} from '../../util';
import {ColorInput} from '../../controls';
import {Color} from '../../canvas/drawing/color';

import {Shape} from './shape';

/**
 * Component to edit the shared properties of all shapes
 */
@Component({
    selector: "dk-generic-shape-component",
    template: `
        <dk-color-component
            [color]="shape.fillColor"
            (colorChanged)="onColorChanged($event)">
        </dk-color-component>
    `
})
export class GenericShapeComponent {
    @Input() shape : Shape;
    @Output() shapeChanged = new EventEmitter<Shape>();

    onColorChanged(newColor : Color) {
        this.shapeChanged.emit(immutableAssign(this.shape, {fillColor: newColor}));
    }
}
