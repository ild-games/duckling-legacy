import { Component, Input, Output, EventEmitter } from "@angular/core";

import { Vector } from "../math/vector";
import { immutableAssign } from "../util/model";

import { NumberInputComponent } from "./number-input.component";
import { Validator } from "./validated-input.component";

/**
 * Component that allows a user to input values for a vector.
 */
@Component({
    selector: "dk-vector-input",
    styleUrls: ["./duckling/controls/vector-input.component.css"],
    template: `
        <dk-number-input
            [label]="xLabel"
            [value]="value?.x"
            [disabled]="xDisabled"
            [validator]="xValidator"
            (validInput)="onXInput($event)">
        </dk-number-input>
        <dk-number-input
            [label]="yLabel"
            [value]="value?.y"
            [disabled]="yDisabled"
            [validator]="yValidator"
            (validInput)="onYInput($event)">
        </dk-number-input>
    `,
})
export class VectorInputComponent {
    @Input() xLabel: string = "X";
    @Input() yLabel: string = "Y";
    @Input() value: Vector;
    @Input() xValidator: Validator;
    @Input() yValidator: Validator;
    @Input() xDisabled: boolean = false;
    @Input() yDisabled: boolean = false;

    /**
     * Event published when the user enters a valid input.
     */
    @Output() validInput = new EventEmitter<Vector>();

    onXInput(x: number) {
        this.validInput.emit(immutableAssign(this.value, { x }));
    }

    onYInput(y: number) {
        this.validInput.emit(immutableAssign(this.value, { y }));
    }
}
