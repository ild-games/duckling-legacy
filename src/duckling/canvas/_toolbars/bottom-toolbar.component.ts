import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

import {NumberInput, VectorInput} from '../../controls';
import {Vector} from '../../math/vector';

@Component({
    selector: "dk-bottom-toolbar",
    directives: [VectorInput, NumberInput],
    styleUrls: ['./duckling/canvas/_toolbars/bottom-toolbar.component.css'],
    template: `
        <div class="inlineEntryField">
            <dk-number-input
                label="Stage Width"
                [value]="stageDimensions.x"
                (validInput)="onStageDimensionsInput($event)">
            </dk-number-input>
            <dk-number-input
                label="Stage Height"
                [value]="stageDimensions.y"
                (validInput)="onStageDimensionsInput($event)">
            </dk-number-input>
        </div>

        <dk-number-input
            class="inlineEntryField"
            label="Grid Size"
            [value]="gridSize"
            (validInput)="onGridSizeInput($event)">
        </dk-number-input>

        <dk-number-input
            class="inlineEntryField"
            label="Scale"
            [value]="scale"
            (validInput)="onScaleInput($event)">
        </dk-number-input>
    `
})
export class BottomToolbarComponent {
    @Input() stageDimensions : Vector;
    @Input() gridSize : number;
    @Input() scale : number;

    @Output() stageDimensionsChanged: EventEmitter<Vector> = new EventEmitter();
    @Output() gridSizeChanged: EventEmitter<number> = new EventEmitter();
    @Output() scaleChanged: EventEmitter<number> = new EventEmitter();

    onStageDimensionsInput(stageDimensions : Vector) {
        this.stageDimensions = stageDimensions;
        this.stageDimensionsChanged.emit(stageDimensions);
    }

    onGridSizeInput(gridSize : number) {
        this.gridSize = gridSize;
        this.gridSizeChanged.emit(gridSize);
    }

    onScaleInput(scale : number) {
        this.scale = scale;
        this.scaleChanged.emit(scale);
    }
}
