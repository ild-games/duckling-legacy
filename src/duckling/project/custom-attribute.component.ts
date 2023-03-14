import { Component, EventEmitter, Output, Input } from "@angular/core";

import { JsonSchema } from "../util/json-schema";

import { CustomAttribute } from "./custom-attribute";
import { ProjectService } from "./project.service";

@Component({
    selector: "dk-custom-attribute",
    template: `
        <dk-json
            [value]="attribute"
            [schema]="schema"
            (valueChanged)="onValueChanged($event)">
        </dk-json>
    `,
})
export class CustomAttributeComponent {
    @Input() attribute: any;
    @Input() key: string;
    @Output() attributeChanged = new EventEmitter<CustomAttribute>();

    constructor(private _project: ProjectService) {}

    onValueChanged(newValue: any) {
        this.attributeChanged.emit(newValue);
    }

    get schema(): JsonSchema {
        return this._project.getCustomAttribute(this.key).content;
    }
}
