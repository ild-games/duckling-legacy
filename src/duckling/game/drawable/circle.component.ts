import { Component, Input, Output, EventEmitter } from "@angular/core";

import { NumberInputComponent } from "../../controls";
import { immutableAssign } from "../../util";

import { Circle } from "./circle";

/**
 * Component used to edit a Circle shape
 */
@Component({
    selector: "dk-circle-drawable",
    template: `
        <dk-number-input
            label="Radius"
            [value]="circle.radius"
            (validInput)="onRadiusInput($event)">
        </dk-number-input>
    `,
})
export class CircleComponent {
    @Input() circle: Circle;
    @Output() circleChanged = new EventEmitter<Circle>();

    onRadiusInput(newRadius: number) {
        this.circleChanged.emit(
            immutableAssign(this.circle, { radius: newRadius })
        );
    }
}
