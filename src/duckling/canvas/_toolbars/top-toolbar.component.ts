import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {BaseTool, ToolService} from '../tools';
import {StoreService} from '../../state';
import {ProjectService} from '../../project';
import {ToolbarOption} from '../../controls';

@Component({
    selector: "dk-top-toolbar",
    styleUrls: ['./duckling/canvas/_toolbars/top-toolbar.component.css'],
    template: `
        <dk-toolbar-button
            icon="floppy-o"
            tooltip="Save Project"
            (click)="project.save()">
        </dk-toolbar-button>
        <dk-toolbar-button
            icon="refresh"
            tooltip="Reload Project"
            (click)="project.reload()">
        </dk-toolbar-button>

        <span class="separator"></span>

        <dk-toolbar-button
            icon="undo"
            tooltip="Undo"
            (click)="store.undo()">
        </dk-toolbar-button>
        <dk-toolbar-button
            icon="repeat"
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

    @Output() toolSelection = new EventEmitter<BaseTool>();

    constructor(public store : StoreService,
                public project : ProjectService,
                public toolService : ToolService) {
        this.toolOptions = this.toolService.toolOptions;
    }

    onToolSelected(tool : ToolbarOption) {
        this.toolSelection.emit(this.toolService.getTool(tool.value));
    }
}
