import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
    ViewContainerRef
} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';

import {BaseTool, ToolService} from '../tools';
import {StoreService} from '../../state';
import {ProjectService} from '../../project';
import {ToolbarOption, LayerDialogComponent} from '../../controls';
import {MapSelectComponent} from '../../project/map-select.component';
import {EntityLayerService} from '../../entitysystem';

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

    private _layerDialogRef : MdDialogRef<LayerDialogComponent>;

    constructor(public store : StoreService,
                public project : ProjectService,
                public toolService : ToolService,
                private _viewContainer : ViewContainerRef,
                private _materialDialog : MdDialog,
                private _viewContainerRef : ViewContainerRef) {
        this.toolOptions = this.toolService.toolOptions;
    }

    onToolSelected(tool : ToolbarOption) {
        this.toolSelection.emit(this.toolService.getTool(tool.value));
    }

    onChangeMap() {
        MapSelectComponent.open(this._viewContainer).subscribe((mapName) => {
            if (mapName) {
                this.mapSelected.emit(mapName);
            }
        });
    }

    onShowHideLayersClicked() {
        let dialogConfig = new MdDialogConfig();
        dialogConfig.viewContainerRef = this._viewContainerRef;
        this._layerDialogRef = this._materialDialog.open(LayerDialogComponent, dialogConfig);
    }
}
