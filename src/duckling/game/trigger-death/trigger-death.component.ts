import { Component, Input, Output, EventEmitter } from "@angular/core";

import { immutableAssign } from "../../util";

import { TriggerDeathAttribute } from "./trigger-death-attribute";

@Component({
    selector: "dk-trigger-death",
    template: `
        <dk-input
            label="Animation to Watch"
            [value]="attribute.animationToWatch"
            (inputChanged)="onAnimationToWatchInput($event)">
        </dk-input>
    `,
})
export class TriggerDeathComponent {
    @Input() attribute: TriggerDeathAttribute;
    @Output() attributeChanged = new EventEmitter<TriggerDeathAttribute>();

    onAnimationToWatchInput(newAnimationToWatch: string) {
        this.attributeChanged.emit(
            immutableAssign(this.attribute, {
                animationToWatch: newAnimationToWatch,
            })
        );
    }
}
