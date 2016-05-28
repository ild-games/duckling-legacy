import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';
import {MdButton} from '@angular2-material/button';

import {BaseTool, ToolService} from '../tools';
import {StoreService} from '../../state';
import {ToolbarButton, ToolbarButtonGroup, ToolbarOption} from '../../controls';

@Component({
    selector: "dk-top-toolbar",
    directives: [MdButton, ToolbarButton, ToolbarButtonGroup],
    styleUrls: ['./duckling/canvas/_toolbars/top-toolbar.component.css'],
    template: `
        <dk-toolbar-button
            icon="action-undo"
            (click)="store.undo()">
        </dk-toolbar-button>
        <dk-toolbar-button
            icon="action-redo"
            (click)="store.redo()">
        </dk-toolbar-button>

        <span class="separator"></span>

        <dk-toolbar-button-group
            [options]="toolOptions"
            (selected)="onToolSelected($event)">
        </dk-toolbar-button-group>
    `
})
export class TopToolbarComponent {
    tool : BaseTool;

    toolOptions : ToolbarOption[];

    @Output() toolSelection : EventEmitter<BaseTool> = new EventEmitter();

    constructor(public store : StoreService,
                public toolService : ToolService) {
        this.tool = this.toolService.defaultTool;
        this.toolOptions = this.toolService.toolOptions;
    }

    onToolSelected(tool : ToolbarOption) {
        this.tool = this.toolService.getTool(tool.value);
        this.toolSelection.emit(this.tool);
    }
}
