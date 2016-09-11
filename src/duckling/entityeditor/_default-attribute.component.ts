import {
    Component,
    EventEmitter,
    Output,
    Input
} from '@angular/core';

import {JsonComponent} from '../controls';

@Component({
    selector: "dk-default-attribute-component",
    directives: [JsonComponent],
    template: `
    <dk-json [value]="attribute">
    </dk-json>
    `
})
export class DefaultAttributeComponent {
    @Input() attribute : any;

    @Output() attributeChanged = new EventEmitter<any>();
}
