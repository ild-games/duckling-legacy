import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {NumberInput, VectorInput} from '../../controls';
import {Vector} from '../../math/vector';

import {ScaleComponent} from './scale.component';

/**
 * Component for managing the bottom bar controls for the map editor
 */
@Component({
    selector: "dk-bottom-toolbar",
    directives: [
        VectorInput,
        NumberInput,
        ScaleComponent
    ],
    styleUrls: ['./duckling/canvas/_toolbars/bottom-toolbar.component.css'],
    template: `
        <dk-vector-input
            class="inline-entry-field"
            title="Dimension"
            xLabel="Stage Width"
            yLabel="Stage Height"
            [value]="stageDimensions"
            (validInput)="onStageDimensionsInput($event)">
        </dk-vector-input>

        <dk-number-input
            class="inline-entry-field"
            label="Grid Size"
            [value]="gridSize"
            (validInput)="onGridSizeInput($event)">
        </dk-number-input>

        <md-checkbox
            class="show-grid"
            [checked]="showGrid"
            (change)="onShowGridPressed($event.checked)">
            Show Grid?
        </md-checkbox>

        <dk-scale
            [scale]="scale"
            (scaleChanged)="onScaleInput($event)">
        </dk-scale>
    `
})
export class BottomToolbarComponent {
    @Input() stageDimensions : Vector;
    @Input() gridSize : number;
    @Input() scale : number;
    @Input() showGrid : boolean;

    @Output() stageDimensionsChanged = new EventEmitter<Vector>();
    @Output() gridSizeChanged = new EventEmitter<number>();
    @Output() scaleChanged = new EventEmitter<number>();
    @Output() showGridChanged = new EventEmitter<boolean>();

    onStageDimensionsInput(stageDimensions : Vector) {
        this.stageDimensionsChanged.emit(stageDimensions);
    }

    onGridSizeInput(gridSize : number) {
        this.gridSizeChanged.emit(gridSize);
    }

    onScaleInput(scale : number) {
        this.scaleChanged.emit(scale);
    }

    onShowGridPressed(showGrid : boolean) {
        this.showGridChanged.emit(showGrid);
    }
}
