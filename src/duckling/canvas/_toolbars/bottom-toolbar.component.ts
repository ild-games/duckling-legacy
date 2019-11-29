import { Component, Input, Output, EventEmitter } from "@angular/core";

import { Vector } from "../../math/vector";

/**
 * Component for managing the bottom bar controls for the map editor
 */
@Component({
    selector: "dk-bottom-toolbar",
    styleUrls: ["./duckling/canvas/_toolbars/bottom-toolbar.component.css"],
    template: `
        <dk-number-input
            class="grid-size"
            label="Grid Size"
            [value]="gridSize"
            (validInput)="onGridSizeInput($event)">
        </dk-number-input>

        <mat-checkbox
            class="show-grid"
            [checked]="showGrid"
            (change)="onShowGridPressed($event.checked)">
            Show Grid?
        </mat-checkbox>

        <dk-canvas-scale
            [scale]="scale"
            (scaleChanged)="onScaleInput($event)">
        </dk-canvas-scale>
    `,
})
export class BottomToolbarComponent {
    @Input() gridSize: number;
    @Input() scale: number;
    @Input() showGrid: boolean;

    @Output() gridSizeChanged = new EventEmitter<number>();
    @Output() scaleChanged = new EventEmitter<number>();
    @Output() showGridChanged = new EventEmitter<boolean>();

    onGridSizeInput(gridSize: number) {
        this.gridSizeChanged.emit(gridSize);
    }

    onScaleInput(scale: number) {
        this.scaleChanged.emit(scale);
    }

    onShowGridPressed(showGrid: boolean) {
        this.showGridChanged.emit(showGrid);
    }
}
