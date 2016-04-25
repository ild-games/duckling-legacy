import {
    Component
} from 'angular2/core';
import {DisplayObject} from 'pixi.js';
import {Observable} from 'rxjs';

import {ArraySelect, SelectOption} from '../controls';
import {EntitySystemService} from '../entitysystem/';
import {Canvas} from './canvas.component';
import {EntityDrawerService} from './drawing/entity-drawer.service';
import {EntityCreatorTool, BaseTool, EntityMoveTool, TOOL_PROVIDERS} from './tools';

/**
 * The MapEditorComponent contains the canvas and tools needed to interact with the map.
 */
@Component({
    selector: "dk-map-editor",
    directives: [Canvas, ArraySelect],
    viewProviders : [TOOL_PROVIDERS],
    template: `
        <dk-array-select
            [value]="selectedTool"
            [options]="toolOptions"
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
    selectedTool : string = "move";
    toolOptions : SelectOption [] = [
            { value: "move", title: "Move Entity" },
            { value: "create", title: "Create Entity" }];

    constructor(private _entitySystemService : EntitySystemService,
                private _moveTool : EntityMoveTool,
                private _createTool : EntityCreatorTool,
                private _entityDrawerService : EntityDrawerService) {
        this._entitySystemService.entitySystem
            .map(this._entityDrawerService.getSystemMapper())
            .subscribe(stage => this.mapStage = stage);
        this.tool = this._moveTool;
    }

    onToolSelected(toolName : string) {
        this.selectedTool = toolName;
        switch (toolName) {
            case "move":
                this.tool = this._moveTool;
                break;
            case "create":
                this.tool = this._createTool;
                break;
        }
    }
}
