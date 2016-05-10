import {
    Component
} from 'angular2/core';
import {DisplayObject} from 'pixi.js';
import {Observable} from 'rxjs';

import {ArraySelect, SelectOption} from '../controls';
import {EntitySystemService} from '../entitysystem/';
import {Canvas} from './canvas.component';
import {EntityDrawerService} from './drawing/entity-drawer.service';
import {BaseTool, TOOL_PROVIDERS, ToolService} from './tools';

/**
 * The MapEditorComponent contains the canvas and tools needed to interact with the map.
 */
@Component({
    selector: "dk-map-editor",
    directives: [Canvas, ArraySelect],
    viewProviders : [TOOL_PROVIDERS],
    template: `
        <dk-array-select
            [value]="tool.key"
            [options]="options"
            (selection)="onToolSelected($event)">
        </dk-array-select>

        <dk-canvas
            [tool]="tool"
            [width]="width"
            [height]="height"
            [stage]="mapStage">
        </dk-canvas>
    `
})
export class MapEditorComponent {
    width : number = 500
    height : number = 400;
    mapStage : DisplayObject;

    tool : BaseTool;
    options : SelectOption [];

    constructor(private _entitySystemService : EntitySystemService,
                public toolService : ToolService,
                private _entityDrawerService : EntityDrawerService) {

        this._entitySystemService.entitySystem
            .map(this._entityDrawerService.getSystemMapper())
            .subscribe(stage => this.mapStage = stage);

        this.tool = this.toolService.defaultTool;
        this.options = this.toolService.toolOptions;
    }

    onToolSelected(toolKey : string) {
        this.tool = this.toolService.getTool(toolKey);
    }
}
