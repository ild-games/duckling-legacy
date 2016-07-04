import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

import {immutableAssign} from '../../util/model';

import {ShapeDrawable} from './shape-drawable';

@Component({
    selector: "dk-generic-shape-drawable-component",
    directives: [ MD_INPUT_DIRECTIVES ],
    template: `
        <md-input
            placeholder="Color"
            [value]="shapeDrawable.color"
            (input)="onColorInput($event.target.value)">
        </md-input>
    `
})
export class GenericShapeDrawableComponent {
    @Input() shapeDrawable : ShapeDrawable;
    @Output() shapeDrawableChanged = new EventEmitter<ShapeDrawable>();

    onColorInput(newColor : string) {
        this.shapeDrawableChanged.emit(immutableAssign(this.shapeDrawable, {color: newColor}));
    }
}
