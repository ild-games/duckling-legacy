import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';
import {MdButton} from '@angular2-material/button';

import {ToolbarButton} from './toolbar-button.component';

@Component({
    selector: "dk-toolbar-button-group",
    directives: [MdButton, ToolbarButton],
    template: `
        <span *ngFor="#option of options">
            <dk-toolbar-button
                *ngIf="selectedValue === option.value"
                color="primary"
                [icon]="option.icon"
                [text]="option.title"
                (selected)="buttonClicked($event, option.value)">
            </dk-toolbar-button>

            <dk-toolbar-button
                *ngIf="selectedValue !== option.value"
                [icon]="option.icon"
                [text]="option.title"
                (selected)="buttonClicked($event, option.value)">
            </dk-toolbar-button>
        </span>
    `
})
export class ToolbarButtonGroup {
    @Input() options : ToolbarOption[];
    @Output() selected : EventEmitter<ToolbarOption> = new EventEmitter<ToolbarOption>();

    selectedValue : string = "";

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
