import {
    AfterViewInit,
    Component,
    ViewChild,
    ElementRef
} from 'angular2/core';
import {DisplayObject} from 'pixi.js';
import {Observable} from 'rxjs';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {ipcRenderer} from 'electron';

import {StoreService} from '../state';
import {ProjectService} from '../project';
import {Canvas} from './canvas.component';
import {EntityDrawerService} from './drawing/entity-drawer.service';
import {BaseTool, TOOL_PROVIDERS, ToolService} from './tools';
import {ArraySelect, SelectOption} from '../controls';
import {EntitySystemService} from '../entitysystem/';
import {WindowService} from '../util';


/**
 * The MapEditorComponent contains the canvas and tools needed to interact with the map.
 */
@Component({
    selector: "dk-map-editor",
    directives: [Canvas, ArraySelect, MD_CARD_DIRECTIVES],
    viewProviders : [TOOL_PROVIDERS],
    styleUrls: ['./duckling/canvas/map-editor.component.css'],
    template: `
        <md-card>
            <md-card-content>
                <div class="content">
                    <div class="canvas-top-toolbar">
                        <dk-array-select
                            [value]="tool.key"
                            [options]="options"
                            (selection)="onToolSelected($event)">
                        </dk-array-select>
                        <button (click)="store.undo()">Undo</button>
                        <button (click)="store.redo()">Redo</button>
                        <button (click)="project.save()">Save</button>
                        <button (click)="project.reload()">Load</button>
                    </div>

                    <div #canvasContainerDiv
                    class="canvas-container"
                    (window:resize)="onResize($event)">
                        <dk-canvas
                            [tool]="tool"
                            [width]="width"
                            [height]="height"
                            [stage]="mapStage">
                        </dk-canvas>
                    </div>

                    <div class="canvas-bottom-toolbar">
                        Bottom Toolbar
                    </div>
                </div>
            </md-card-content>
        </md-card>
    `
})
export class MapEditorComponent {
    width : number = 500
    height : number = 400;
    mapStage : DisplayObject;

    tool : BaseTool;
    options : SelectOption [];

    @ViewChild('canvasContainerDiv')
    canvasContainerDiv : ElementRef;

    constructor(private _entitySystemService : EntitySystemService,
                public toolService : ToolService,
                public store : StoreService,
                public project : ProjectService,
                private _window : WindowService,
                private _entityDrawerService : EntityDrawerService) {
        this._entitySystemService.entitySystem
            .map(this._entityDrawerService.getSystemMapper())
            .subscribe(stage => this.mapStage = stage);

        this.tool = this.toolService.defaultTool;
        this.options = this.toolService.toolOptions;
    }

    onResize(event : any) {
        this.width = this.canvasContainerDiv.nativeElement.clientWidth;
        this.height = this.canvasContainerDiv.nativeElement.clientHeight;
    }

    onToolSelected(toolKey : string) {
        this.tool = this.toolService.getTool(toolKey);
    }
}
