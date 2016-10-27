import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild,
    OnDestroy
} from '@angular/core';
import {
    Container,
    DisplayObject,
    Graphics
} from 'pixi.js';
import {Subscriber} from 'rxjs';
import {TimerObservable} from 'rxjs/observable/TimerObservable';

import {StoreService} from '../state';
import {AssetService, Asset, ProjectService} from '../project';
import {ArraySelectComponent, SelectOption} from '../controls';
import {EntitySystemService, Entity} from '../entitysystem/';
import {EntityBoxService} from '../entitysystem/services';
import {Vector} from '../math';
import {KeyboardService} from '../util';
import {CopyPasteService, SelectionService} from '../selection';

import {
    EntityDrawerService,
    DrawnConstruct,
    AnimationConstruct,
    isAnimationConstruct,
    ContainerConstruct,
    isContainerConstruct,
    displayObjectsForDrawnConstructs
} from './drawing';
import {TopToolbarComponent, BottomToolbarComponent} from './_toolbars';
import {CanvasComponent} from './canvas.component';
import {drawRectangle, drawGrid, drawCanvasBorder, drawCanvasBackground} from './drawing/util';
import {BaseTool, ToolService, MapMoveTool, BimodalTool} from './tools';

/**
 * The MapEditorComponent contains the canvas and tools needed to interact with the map.
 */
@Component({
    selector: "dk-map-editor",
    styleUrls: ['./duckling/canvas/map-editor.component.css'],
    template: `
        <md-card>
            <md-card-content>
                <dk-top-toolbar
                    class="canvas-top-toolbar md-elevation-z4"
                    [selectedToolKey]="tool.key"
                    [mapName]="projectService.project.getValue().currentMap"
                    (toolSelection)="onToolSelected($event)"
                    (mapSelected)="openMap($event)">
                </dk-top-toolbar>

                <dk-canvas #canvasElement
                    class="canvas"
                    [tool]="tool"
                    [stageDimensions]="stageDimensions"
                    [gridSize]="gridSize"
                    [scale]="scale"
                    [showGrid]="showGrid"
                    [canvasDisplayObject]="canvasDisplayObject"
                    (elementCopy)="copyEntity()"
                    (elementPaste)="pasteEntity($event)"
                    (scaleChanged)="onScaleChanged($event)">
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
export class MapEditorComponent implements AfterViewInit, OnDestroy {
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
    private _toolDisplayObject : DisplayObject;
    private _framesPerSecond = 30;
    private _totalMillis = 0;
    private _lastDrawnConstructs : DrawnConstruct[] = [];
    private _entitySystemSubscription : Subscriber<any>;
    private _assetServiceSubscription : Subscriber<any>;
    private _selectionServiceSubscription : Subscriber<any>;
    private _redrawInterval : Subscriber<any>;

    @ViewChild('canvasElement') canvasElement : ElementRef;

    constructor(private _entitySystemService : EntitySystemService,
                private _selection : SelectionService,
                private _copyPaste : CopyPasteService,
                private _toolService : ToolService,
                private _assetService : AssetService,
                public projectService : ProjectService,
                private _entityDrawerService : EntityDrawerService,
                private _keyboardService : KeyboardService,
                private _entityBoxService : EntityBoxService) {
        this._setTool(this._toolService.defaultTool);
    }

    ngAfterViewInit() {
        this._redrawAllDisplayObjects();

        this._entitySystemSubscription = this._entitySystemService.entitySystem
            .map(this._entityDrawerService.getSystemMapper())
            .subscribe((drawnConstructs) => {
                this._entitiesDrawnConstructsChanged(drawnConstructs);
            }) as Subscriber<any>;

        this._selectionServiceSubscription = this._selection.selection.subscribe(()=> {
            this._redrawAllDisplayObjects();
        }) as Subscriber<any>;

        this._assetServiceSubscription = this._assetService.assetLoaded.subscribe((asset : Asset) => {
            let drawnConstructs = this._entityDrawerService.getSystemMapper()(this._entitySystemService.entitySystem.value);
            this._entitiesDrawnConstructsChanged(drawnConstructs);
            this._redrawAllDisplayObjects();
        }) as Subscriber<any>;

        this._redrawInterval = TimerObservable
            .create(0, 1000 / this._framesPerSecond)
            .subscribe(() => this._drawFrame()) as Subscriber<any>;
    }

    ngOnDestroy() {
        this._entitySystemSubscription.unsubscribe();
        this._assetServiceSubscription.unsubscribe();
        this._selectionServiceSubscription.unsubscribe();
        this._redrawInterval.unsubscribe();
    }

    private _entitiesDrawnConstructsChanged(newDrawnConstructs : DrawnConstruct[]) {
        this._lastDrawnConstructs = newDrawnConstructs;
        this._createEntitiesDisplayObject(newDrawnConstructs)
    }

    private _drawFrame() {
        this._totalMillis += (1000 / this._framesPerSecond);
        this._createEntitiesDisplayObject(this._lastDrawnConstructs);
    }

    private _createEntitiesDisplayObject(entitiesDrawnConstructs : DrawnConstruct[]) {
        let entitiesDrawnContainer = new Container();
        for (let entityDisplayObject of displayObjectsForDrawnConstructs(entitiesDrawnConstructs, this._totalMillis)) {
            if (entityDisplayObject) {
                entitiesDrawnContainer.addChild(entityDisplayObject);
            }
        }
        entitiesDrawnContainer.interactiveChildren = false;

        this._entitiesDisplayObject = entitiesDrawnContainer;
        this.canvasDisplayObject = this._buildCanvasDisplayObject();
    }

    copyEntity() {
        let selection = this._selection.selection.value;
        this._copyPaste.copy(selection.selectedEntity);
    }

    pasteEntity(position : Vector) {
        this._copyPaste.paste(position);
    }

    onToolSelected(newTool : BaseTool) {
        this._setTool(newTool);
        this._redrawAllDisplayObjects();
    }

    onStageDimensonsChanged(stageDimensions : Vector) {
        this.stageDimensions = stageDimensions;
        this._redrawAllDisplayObjects();
    }

    onGridSizeChanged(gridSize : number) {
        this.gridSize = gridSize;
        this._gridDisplayObject = this._buildGrid();
        this.canvasDisplayObject = this._buildCanvasDisplayObject();
    }

    onScaleChanged(scale : number) {
        this.scale = scale;
        this._redrawAllDisplayObjects();
    }

    onShowGridChanged(showGrid : boolean) {
        this.showGrid = showGrid;
        this.canvasDisplayObject = this._buildCanvasDisplayObject();
    }

    openMap(mapKey : string) {
        this.projectService.openMap(mapKey);
    }

    private _redrawAllDisplayObjects() {
        this._canvasBackgroundDisplayObject = this._buildCanvasBackground();
        this._canvasBorderDisplayObject = this._buildCanvasBorder();
        this._gridDisplayObject = this._buildGrid();
        this._toolDisplayObject = this.tool.getDisplayObject(this.scale);
        this.canvasDisplayObject = this._buildCanvasDisplayObject();
    }

    private _buildGrid() : DisplayObject {
        let graphics = new Graphics();
        graphics.lineStyle(1 / this.scale, 0xEEEEEE, 0.5);
        drawGrid(
            {x: 0, y: 0},
            {x: this.stageDimensions.x, y: this.stageDimensions.y},
            {x: this.gridSize, y: this.gridSize},
            graphics);
        return graphics;
    }

    private _buildCanvasBackground() : DisplayObject {
        let bg = new Graphics();
        drawCanvasBackground(
            {x: 0, y: 0},
            this.stageDimensions,
            bg);
        return bg;
    }

    private _buildCanvasBorder() : DisplayObject {
        let border = new Graphics();
        border.lineWidth = 1 / this.scale;
        drawCanvasBorder(
            {x: 0, y: 0},
            this.stageDimensions,
            border);
        return border;
    }

    private _buildCanvasDisplayObject() : Container {
        let canvasDrawnElements : Container = new Container();

        if (this._canvasBackgroundDisplayObject) {
            canvasDrawnElements.addChild(this._canvasBackgroundDisplayObject);
        }
        if (this._entitiesDisplayObject) {
            canvasDrawnElements.addChild(this._entitiesDisplayObject);
        }
        if (this._toolDisplayObject) {
            canvasDrawnElements.addChild(this._toolDisplayObject);
        }
        if (this.showGrid && this._gridDisplayObject) {
            canvasDrawnElements.addChild(this._gridDisplayObject);
        }
        if (this._canvasBorderDisplayObject) {
            canvasDrawnElements.addChild(this._canvasBorderDisplayObject);
        }
        return canvasDrawnElements;
    }

    private _setTool(tool : BaseTool) {
        this.tool = new BimodalTool(tool, this._toolService.getTool("MapMoveTool"), this._keyboardService);
    }
}
