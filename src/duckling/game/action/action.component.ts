import { Component, Input, Output, EventEmitter } from "@angular/core";

import { immutableAssign } from "../../util/model";

import { ActionAttribute } from "./action-attribute";

@Component({
    selector: "dk-action",
    template: `
        <mat-checkbox
            [checked]="attribute.actions.affectedByGravity"
            (change)="onAffectedByGravityChanged($event.checked)">
            Affected by Gravity?
        </mat-checkbox>
    `,
})
export class ActionComponent {
    @Input() attribute: ActionAttribute;
    @Output() attributeChanged = new EventEmitter<ActionAttribute>();

    onAffectedByGravityChanged(newAffectedByGravity: boolean) {
        let newActions = immutableAssign(this.attribute.actions, {
            affectedByGravity: newAffectedByGravity,
        });
        this.attributeChanged.emit(
            immutableAssign(this.attribute, { actions: newActions })
        );
    }
}
