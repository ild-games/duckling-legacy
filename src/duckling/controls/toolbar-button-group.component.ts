import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {ToolbarButton} from './toolbar-button.component';

@Component({
    selector: "dk-toolbar-button-group",
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
export class ToolbarButtonGroup {
    @Input() options : ToolbarOption[];
    @Output() selected : EventEmitter<ToolbarOption> = new EventEmitter<ToolbarOption>();
    @Input() selectedValue : string = "";

    private buttonClicked(event : MouseEvent, clickedValue : string) {
        var clickedOption : ToolbarOption = null;
        for (var i = 0; i < this.options.length; i++) {
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
