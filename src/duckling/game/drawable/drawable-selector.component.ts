import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';

import {DrawableType} from './drawable-attribute';
import {EnumSelect, SelectOption} from '../../controls';

@Component({
    selector: "dk-drawable-selector-component",
    directives: [EnumSelect],
    template: `
        <dk-enum-select
            [value]="selected"
            [enum]="DrawableType"
            (selection)="select($event)">
        </dk-enum-select>
        <button (click)="onAddClicked()">
            Add
        </button>
    `
})
export class DrawableSelectorComponent {
    // hoist DrawableType so template can access it
    DrawableType = DrawableType;

    @Input() selected : DrawableType = DrawableType.Shape;
    @Output() addClicked = new EventEmitter<DrawableType>();

    select(drawableType : DrawableType) {
        this.selected = drawableType;
    }

    onAddClicked() {
        this.addClicked.emit(this.selected);
    }
}
