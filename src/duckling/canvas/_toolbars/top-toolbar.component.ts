import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';
import {MdButton} from '@angular2-material/button';

import {BaseTool, ToolService} from '../tools';
import {ArraySelect, SelectOption} from '../../controls';
import {StoreService} from '../../state';

@Component({
    selector: "dk-top-toolbar",
    directives: [ArraySelect, MdButton],
    styleUrls: ['./duckling/canvas/_toolbars/top-toolbar.component.css'],
    template: `
        <button md-button class="undo-button" (click)="store.undo()">
        &nbsp;
        </button>
        <button md-button class="redo-button" (click)="store.redo()">
        &nbsp;
        </button>
        <span class="separator"></span>
        <span *ngFor="#option of toolOptions">
            <button md-button
            *ngIf="option.value === tool.key"
            color="primary"
            (click)="onToolSelected($event, option)">
                {{option.title}}
            </button>
            <button md-button
            *ngIf="option.value !== tool.key"
            (click)="onToolSelected($event, option)">
                {{option.title}}
            </button>
        </span>
    `
})
export class TopToolbarComponent {
    tool : BaseTool;

    toolOptions : SelectOption[];

    @Output() toolSelection : EventEmitter<BaseTool> = new EventEmitter();

    constructor(public store : StoreService,
                public toolService : ToolService) {
        this.tool = this.toolService.defaultTool;
        this.toolOptions = this.toolService.toolOptions;
    }

    onToolSelected(event : MouseEvent, tool : SelectOption) {
        this.tool = this.toolService.getTool(tool.value);
        this.toolSelection.emit(this.tool);
    }
}
