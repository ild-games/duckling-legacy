import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
    ViewContainerRef
} from '@angular/core';
import {MatDialog} from '@angular/material';

import {BaseTool, ToolService} from '../tools';
import {StoreService} from '../../state';
import {ToolbarOption} from '../../controls';
import {MapSelectComponent} from '../../project/map-select.component';
import {EntityLayerService} from '../../entitysystem';
import {LayerDialogComponent} from '../../entitysystem/services/layer-dialog.component';

@Component({
    selector: "dk-top-toolbar",
    styleUrls: ['./duckling/canvas/_toolbars/top-toolbar.component.css'],
    template: `
        <dk-toolbar-button
            icon="floppy-o"
            tooltip="Save Project"
            (click)="onSaveClicked()">
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

        <dk-toolbar-button
            icon="eye"
            tooltip="Show/hide layers"
            (click)="onShowHideLayersClicked()">
        </dk-toolbar-button>

        <span class="separator"></span>

        <dk-toolbar-button-group
            [options]="toolOptions"
            [selectedValue]="selectedToolKey"
            (selected)="onToolSelected($event)">
        </dk-toolbar-button-group>

        <span class="map-name">
            <dk-inline-edit-label
                label="Map: {{mapName}}"
                tooltip="Select a different map"
                (startEdit)="onChangeMap()">
            </dk-inline-edit-label>
        </span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopToolbarComponent {
    toolOptions : ToolbarOption[];
    @Input() selectedToolKey : string;

    @Output() toolSelection = new EventEmitter<BaseTool>();

    @Input() mapName : string;

    @Output() mapSelected = new EventEmitter<String>();
    @Output() saveClicked = new EventEmitter<void>();

    constructor(public store : StoreService,
                public toolService : ToolService,
                private _viewContainer : ViewContainerRef,
                private _dialog : MatDialog) {
        this.toolOptions = this.toolService.toolOptions;
    }

    onToolSelected(tool : ToolbarOption) {
        this.toolSelection.emit(this.toolService.getTool(tool.value));
    }

    onChangeMap() {
        this._dialog.open(MapSelectComponent).afterClosed().subscribe((mapName : string) => {
            if (mapName) {
                this.mapSelected.emit(mapName);
            }
        });
    }

    onSaveClicked() {
        this.saveClicked.emit();
    }

    onShowHideLayersClicked() {
        this._dialog.open(LayerDialogComponent);
    }
}
