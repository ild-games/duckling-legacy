import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {ToolbarButtonComponent} from './toolbar-button.component';

@Component({
    selector: "dk-toolbar-button-group",
    styleUrls: ['../build/duckling/controls/toolbar-button-group.component.css'],
    template: `
        <span *ngFor="let option of options">
            <dk-toolbar-button
                [color]="selectedValue === option.value ? 'primary' : 'none'"
                [icon]="option.icon"
                [text]="option.title"
                (click)="buttonClicked($event, option.value)">
            </dk-toolbar-button>
        </span>
    `
})
export class ToolbarButtonGroupComponent {
    @Input() options : ToolbarOption[];
    @Output() selected : EventEmitter<ToolbarOption> = new EventEmitter<ToolbarOption>();
    @Input() selectedValue : string = "";

    buttonClicked(event : MouseEvent, clickedValue : string) {
        let clickedOption : ToolbarOption = null;
        for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].value === clickedValue) {
                clickedOption = this.options[i];
            }
        }
        if (clickedOption) {
            this.selectedValue = clickedValue;
            this.selected.emit(clickedOption);
        }
    }
}

export interface ToolbarOption {
    value : string,
    title : string,
    icon : string
}
