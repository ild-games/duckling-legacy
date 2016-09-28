import {
    Component,
    EventEmitter,
    Output,
    Input
} from '@angular/core';

@Component({
    selector: "dk-default-attribute",
    template: `
        <dk-json
            [value]="attribute"
            (valueChanged)="onValueChanged($event)">
        </dk-json>
    `
})
export class DefaultAttributeComponent {
    @Input() attribute : any;

    @Output() attributeChanged = new EventEmitter<any>();

    onValueChanged(newValue : any) {
        this.attributeChanged.emit(newValue);
    }
}
