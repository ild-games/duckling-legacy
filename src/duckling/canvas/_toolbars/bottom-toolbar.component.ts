import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';
import {MdCheckbox} from '@angular2-material/checkbox';

import {NumberInput, VectorInput} from '../../controls';
import {Vector} from '../../math/vector';

@Component({
    selector: "dk-bottom-toolbar",
    directives: [VectorInput, NumberInput, MdCheckbox],
    styleUrls: ['./duckling/canvas/_toolbars/bottom-toolbar.component.css'],
    template: `
        <div class="inlineEntryField">
            <dk-vector-input
                title="Dimension"
                xLabel="Stage Width"
                yLabel="Stage Height"
                [value]="stageDimensions"
                (validInput)="onStageDimensionsInput($event)">
            </dk-vector-input>
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

        <md-checkbox
            class="showGrid"
            [checked]="showGrid"
            (change)="onShowGridPressed($event)">
            Show Grid?
        </md-checkbox>
    `
})
export class BottomToolbarComponent {
    @Input() stageDimensions : Vector;
    @Input() gridSize : number;
    @Input() scale : number;
    @Input() showGrid : boolean;

    @Output() stageDimensionsChanged: EventEmitter<Vector> = new EventEmitter();
    @Output() gridSizeChanged: EventEmitter<number> = new EventEmitter();
    @Output() scaleChanged: EventEmitter<number> = new EventEmitter();
    @Output() showGridChanged: EventEmitter<boolean> = new EventEmitter();

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

    onShowGridPressed(showGrid : boolean) {
        this.showGrid = showGrid;
        this.showGridChanged.emit(this.showGrid);
    }
}
