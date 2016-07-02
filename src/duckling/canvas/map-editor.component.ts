import {
    Component
} from 'angular2/core';
import {DisplayObject} from 'pixi.js';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';

import {StoreService} from '../state';
import {Canvas} from './canvas.component';
import {EntityDrawerService} from './drawing/entity-drawer.service';
import {BaseTool, TOOL_PROVIDERS, ToolService} from './tools';
import {ArraySelect, SelectOption} from '../controls';
import {EntitySystemService} from '../entitysystem/';
import {Vector} from '../math';
import {CopyPasteService, SelectionService} from '../selection';
import {TopToolbarComponent} from './_toolbars';

/**
 * The MapEditorComponent contains the canvas and tools needed to interact with the map.
 */
@Component({
    selector: "dk-map-editor",
    directives: [Canvas, TopToolbarComponent, MD_CARD_DIRECTIVES],
    providers : [TOOL_PROVIDERS],
    styleUrls: ['./duckling/canvas/map-editor.component.css'],
    template: `
        <md-card>
            <md-card-content>
                <dk-top-toolbar
                    class="canvas-top-toolbar"
                    (toolSelection)="onToolSelected($event)">
                </dk-top-toolbar>

                <dk-canvas
                    class="canvas"
                    (elementCopy)="copyEntity()"
                    (elementPaste)="pasteEntity($event)"
                    [tool]="tool"
                    [stage]="mapStage">
                </dk-canvas>

                <div class="canvas-bottom-toolbar">
                    Bottom Toolbar
                </div>
            </md-card-content>
        </md-card>
    `
})
export class MapEditorComponent {
    mapStage : DisplayObject;
    tool : BaseTool;

    constructor(private _entitySystemService : EntitySystemService,
                public toolService : ToolService,
                public store : StoreService,
                private _entityDrawerService : EntityDrawerService,
                private _selection : SelectionService,
                private _copyPaste : CopyPasteService) {

        this._entitySystemService.entitySystem
            .map(this._entityDrawerService.getSystemMapper())
            .subscribe(stage => this.mapStage = stage);
        this.tool = this.toolService.defaultTool;
    }

    copyEntity() {
        var selection = this._selection.selection.value;
        this._copyPaste.copy(selection.selectedEntity);
    }

    pasteEntity(position : Vector) {
        this._copyPaste.paste(position);
    }

    onToolSelected(newTool : BaseTool) {
        this.tool = newTool;
    }
}
