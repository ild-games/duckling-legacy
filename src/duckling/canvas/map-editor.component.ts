import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild
} from '@angular/core';
import {
    Container,
    DisplayObject,
    Graphics
} from 'pixi.js';

import {StoreService} from '../state';
import {AssetService} from '../project';
import {ArraySelect, SelectOption} from '../controls';
import {EntitySystemService} from '../entitysystem/';
import {Vector} from '../math';
import {CopyPasteService, SelectionService} from '../selection';

import {TopToolbarComponent, BottomToolbarComponent} from './_toolbars';
import {Canvas} from './canvas.component';
import {EntityDrawerService, DrawnConstruct, Animation, isAnimation} from './drawing';
import {drawRectangle, drawGrid, drawCanvasBorder, drawCanvasBackground} from './drawing/util';
import {BaseTool, TOOL_PROVIDERS, ToolService, MapMoveTool} from './tools';

/**
 * The MapEditorComponent contains the canvas and tools needed to interact with the map.
 */
@Component({
    selector: "dk-map-editor",
    directives: [Canvas, TopToolbarComponent, BottomToolbarComponent],
    providers : [TOOL_PROVIDERS],
    styleUrls: ['./duckling/canvas/map-editor.component.css'],
    template: `
        <md-card>
            <md-card-content>
                <dk-top-toolbar
                    class="canvas-top-toolbar md-elevation-z4"
                    (toolSelection)="onToolSelected($event)">
                </dk-top-toolbar>

                <dk-canvas #canvasElement
                    class="canvas"
                    (elementCopy)="copyEntity()"
                    (elementPaste)="pasteEntity($event)"
                    [tool]="tool"
                    [stageDimensions]="stageDimensions"
                    [gridSize]="gridSize"
                    [scale]="scale"
                    [showGrid]="showGrid"
                    [canvasDisplayObject]="canvasDisplayObject">
                </dk-canvas>

                <dk-bottom-toolbar
                    class="canvas-bottom-toolbar md-elevation-z4"
                    [stageDimensions]="stageDimensions"
                    [gridSize]="gridSize"
                    [scale]="scale"
                    [showGrid]="showGrid"
                    (stageDimensionsChanged)="onStageDimensonsChanged($event)"
                    (gridSizeChanged)="onGridSizeChanged($event)"
                    (scaleChanged)="onScaleChanged($event)"
                    (showGridChanged)="onShowGridChanged($event)">
                </dk-bottom-toolbar>
            </md-card-content>
        </md-card>
    `
})
export class MapEditorComponent implements AfterViewInit {
    /**
     * Current tool in use
     */
    tool : BaseTool;

    /**
     * Size of the stage being edited
     */
    stageDimensions : Vector = {x: 1200, y: 800};

    /**
     * Width/Height dimension of the grid
     */
    gridSize : number = 16;

    /**
     * Scale of the map elements
     */
    scale : number = 1;

    /**
     * Determines if the grid should be rendered with the map
     */
    showGrid : boolean = true;

    /**
     * The display object sent to the canvas with all the visual aspects of the map editor
     */
    canvasDisplayObject : Container = new Container();

    private _entitiesDisplayObject : DisplayObject;
    private _canvasBackgroundDisplayObject : DisplayObject;
    private _canvasBorderDisplayObject : DisplayObject;
    private _gridDisplayObject : DisplayObject;
    private _frameRate = 33.33; // 30 fps
    private _totalMillis = 0;
    private _lastDrawnConstructs : DrawnConstruct[] = [];

    @ViewChild('canvasElement') canvasElement : ElementRef;

    constructor(private _entitySystemService : EntitySystemService,
                private _selection : SelectionService,
                private _copyPaste : CopyPasteService,
                private _toolService : ToolService,
                private _assetService : AssetService,
                private _entityDrawerService : EntityDrawerService) {
        this.tool = this._toolService.defaultTool;
    }

    ngAfterViewInit() {
        this.redrawAllDisplayObjects();

        this._entitySystemService.entitySystem
            .map(this._entityDrawerService.getSystemMapper())
            .subscribe((drawnConstructs) => {
                this.entitiesDrawnConstructsChanged(drawnConstructs);
            });

        this._assetService.assetLoaded.subscribe(() => {
            let drawnConstructs = this._entityDrawerService.getSystemMapper()(this._entitySystemService.entitySystem.value);
            this.entitiesDrawnConstructsChanged(drawnConstructs);
        });

        setInterval(() => this.drawFrame(), this._frameRate);
    }

    private entitiesDrawnConstructsChanged(newDrawnConstructs : DrawnConstruct[]) {
        this._lastDrawnConstructs = newDrawnConstructs;
        this.createEntitiesDisplayObject(newDrawnConstructs)
    }

    private drawFrame() {
        this._totalMillis += this._frameRate;
        this.createEntitiesDisplayObject(this._lastDrawnConstructs);
    }

    private createEntitiesDisplayObject(entitiesDrawnConstructs : DrawnConstruct[]) {
        let entitiesDrawnContainer = new Container();
        for (let entitiesDrawnConstruct of entitiesDrawnConstructs) {
            if (isAnimation(entitiesDrawnConstruct)) {
                entitiesDrawnContainer.addChild(this.determineAnimationDisplayObject(entitiesDrawnConstruct as Animation));
            } else {
                entitiesDrawnContainer.addChild(this._entitiesDisplayObject = entitiesDrawnConstruct as DisplayObject);
            }
        }
        entitiesDrawnContainer.interactiveChildren = false;
        this._entitiesDisplayObject = entitiesDrawnContainer;
        this.canvasDisplayObject = this.buildCanvasDisplayObject();
    }

    private determineAnimationDisplayObject(animation : Animation) : DisplayObject {
        let curFrame = 0;
        if (animation.duration !== 0) {
            curFrame = Math.trunc(this._totalMillis / animation.duration) % animation.frames.length;
        }

        if (animation.frames[curFrame]) {
            return animation.frames[curFrame];
        }
        return new DisplayObject();
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

    onStageDimensonsChanged(stageDimensions : Vector) {
        this.stageDimensions = stageDimensions;
        this.redrawAllDisplayObjects();
    }

    onGridSizeChanged(gridSize : number) {
        this.gridSize = gridSize;
        this._gridDisplayObject = this.buildGrid();
        this.canvasDisplayObject = this.buildCanvasDisplayObject();
    }

    onScaleChanged(scale : number) {
        this.scale = scale;
        this.redrawAllDisplayObjects();
    }

    onShowGridChanged(showGrid : boolean) {
        this.showGrid = showGrid;
        this.canvasDisplayObject = this.buildCanvasDisplayObject();
    }

    private redrawAllDisplayObjects() {
        this._canvasBackgroundDisplayObject = this.buildCanvasBackground();
        this._canvasBorderDisplayObject = this.buildCanvasBorder();
        this._gridDisplayObject = this.buildGrid();
        this.canvasDisplayObject = this.buildCanvasDisplayObject();
    }

    private buildGrid() : DisplayObject {
        var graphics = new Graphics();
        graphics.lineStyle(1 / this.scale, 0xEEEEEE, 1);
        drawGrid(
            {x: 0, y: 0},
            {x: this.stageDimensions.x, y: this.stageDimensions.y},
            {x: this.gridSize, y: this.gridSize},
            graphics);
        return graphics;
    }

    private buildCanvasBackground() : DisplayObject {
        var bg = new Graphics();
        drawCanvasBackground(
            {x: 0, y: 0},
            this.stageDimensions,
            bg);
        return bg;
    }

    private buildCanvasBorder() : DisplayObject {
        var border = new Graphics();
        border.lineWidth = 1 / this.scale;
        drawCanvasBorder(
            {x: 0, y: 0},
            this.stageDimensions,
            border);
        return border;
    }

    private buildCanvasDisplayObject() : Container {
        var canvasDrawnElements : Container = new Container();

        if (this._canvasBackgroundDisplayObject) {
            canvasDrawnElements.addChild(this._canvasBackgroundDisplayObject);
        }
        if (this._entitiesDisplayObject) {
            canvasDrawnElements.addChild(this._entitiesDisplayObject);
        }
        if (this.showGrid && this._gridDisplayObject) {
            canvasDrawnElements.addChild(this._gridDisplayObject);
        }
        if (this._canvasBorderDisplayObject) {
            canvasDrawnElements.addChild(this._canvasBorderDisplayObject);
        }

        return canvasDrawnElements;
    }
}
