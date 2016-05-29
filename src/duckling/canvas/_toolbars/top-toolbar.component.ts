import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';
import {MdButton} from '@angular2-material/button';

import {BaseTool, ToolService} from '../tools';
import {StoreService} from '../../state';
import {ProjectService} from '../../project';
import {ToolbarButton, ToolbarButtonGroup, ToolbarOption} from '../../controls';

@Component({
    selector: "dk-top-toolbar",
    directives: [MdButton, ToolbarButton, ToolbarButtonGroup],
    styleUrls: ['./duckling/canvas/_toolbars/top-toolbar.component.css'],
    template: `
        <dk-toolbar-button
            icon="hard-drive"
            tooltip="Save Project"
            (click)="project.save()">
        </dk-toolbar-button>
        <dk-toolbar-button
            icon="reload"
            tooltip="Reload Project"
            (click)="project.reload()">
        </dk-toolbar-button>

        <span class="separator"></span>

        <dk-toolbar-button
            icon="action-undo"
            tooltip="Undo"
            (click)="store.undo()">
        </dk-toolbar-button>
        <dk-toolbar-button
            icon="action-redo"
            tooltip="Redo"
            (click)="store.redo()">
        </dk-toolbar-button>

        <span class="separator"></span>

        <dk-toolbar-button-group
            [options]="toolOptions"
            [selectedValue]="toolService.defaultTool.key"
            (selected)="onToolSelected($event)">
        </dk-toolbar-button-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopToolbarComponent {
    toolOptions : ToolbarOption[];

    @Output() toolSelection : EventEmitter<BaseTool> = new EventEmitter();

    constructor(public store : StoreService,
                public project : ProjectService,
                public toolService : ToolService) {
        this.toolOptions = this.toolService.toolOptions;
    }

    onToolSelected(tool : ToolbarOption) {
        this.toolSelection.emit(this.toolService.getTool(tool.value));
    }
}
