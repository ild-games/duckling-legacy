import {
    Component,
    EventEmitter,
    Output,
    Input
} from '@angular/core';

@Component({
    selector: "dk-default-attribute-component",
    template: `
    <dk-json [value]="attribute">
    </dk-json>
    `
})
export class DefaultAttributeComponent {
    @Input() attribute : any;

    @Output() attributeChanged = new EventEmitter<any>();
}
