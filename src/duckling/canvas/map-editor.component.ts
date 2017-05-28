import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    Container,
    DisplayObject,
    Graphics,
    Sprite,
    Texture
} from 'pixi.js';
import {Subscriber} from 'rxjs';
import {TimerObservable} from 'rxjs/observable/TimerObservable';

import {StoreService} from '../state';
import {AssetService, Asset, ProjectService} from '../project';
import {ArraySelectComponent, SelectOption} from '../controls';
import {EntitySystemService, Entity} from '../entitysystem/';
import {EntityLayerService} from '../entitysystem/services/entity-layer.service';
import {Vector} from '../math';
import {KeyboardService} from '../util';
import {CopyPasteService, SelectionService, Selection} from '../selection';

import {EntityDrawerService, DrawnConstruct} from './drawing';
import {RenderPriorityService} from './drawing/render-priority.service';
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
            <dk-top-toolbar
                class="canvas-top-toolbar mat-elevation-z4"
                [selectedToolKey]="tool.key"
                [mapName]="projectService.project.getValue().currentMap.key"
                (toolSelection)="onToolSelected($event)"
                (mapSelected)="openMap($event)">
            </dk-top-toolbar>

            <dk-canvas #canvasElement
                class="canvas"
                [tool]="tool"
                [stageDimensions]="projectService.project.getValue().currentMap.dimension"
                [gridSize]="projectService.project.getValue().currentMap.gridSize"
                [scale]="scale"
                [showGrid]="showGrid"
                [canvasDisplayObject]="canvasDisplayObject"
                (elementCopy)="copyEntity()"
                (elementPaste)="pasteEntity($event)"
                (scaleChanged)="onScaleChanged($event)">
            </dk-canvas>

            <dk-bottom-toolbar
                class="canvas-bottom-toolbar mat-elevation-z4"
                [stageDimensions]="projectService.project.getValue().currentMap.dimension"
                [gridSize]="projectService.project.getValue().currentMap.gridSize"
                [scale]="scale"
                [showGrid]="showGrid"
                (stageDimensionsChanged)="onStageDimensonsChanged($event)"
                (gridSizeChanged)="onGridSizeChanged($event)"
                (scaleChanged)="onScaleChanged($event)"
                (showGridChanged)="onShowGridChanged($event)">
            </dk-bottom-toolbar>
        </md-card>
    `
})
export class MapEditorComponent implements AfterViewInit, OnInit, OnDestroy {
    /**
     * Current tool in use
     */
    tool : BaseTool;

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

    private _framesPerSecond = 30;
    private _totalMillis = 0;
    private _redrawInterval : Subscriber<any>;
    private _drawerServiceSubscription : Subscriber<any>;
    private _drawnConstructCache : DrawnConstruct[][] = [];

    @ViewChild('canvasElement') canvasElement : ElementRef;
    @ViewChild('canvasElement') canvasComponent : CanvasComponent;

    constructor(private _entitySystemService : EntitySystemService,
                private _selection : SelectionService,
                private _copyPaste : CopyPasteService,
                private _toolService : ToolService,
                private _assetService : AssetService,
                public projectService : ProjectService,
                private _entityDrawerService : EntityDrawerService,
                private _keyboardService : KeyboardService,
                private _entityLayerService : EntityLayerService,
                private _renderPriorityService : RenderPriorityService) {
        this._setTool(this._toolService.defaultTool);
    }

    ngOnInit() {
        this._drawerServiceSubscription = this._entityDrawerService.invalidateDrawableCache.subscribe(() => {
            this._clearCache();
        }) as Subscriber<any>;
    }

    ngAfterViewInit() {
        this._redrawInterval = TimerObservable
            .create(0, 1000 / this._framesPerSecond)
            .subscribe(() => this._drawFrame()) as Subscriber<any>;
    }

    ngOnDestroy() {
        this._redrawInterval.unsubscribe();
        this._drawerServiceSubscription.unsubscribe();
    }

    private _drawFrame() {
        this._totalMillis += (1000 / this._framesPerSecond);
        
        this._redrawAllDisplayObjects();
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
        this._clearCache();
    }

    onStageDimensonsChanged(stageDimensions : Vector) {
        this.projectService.changeDimension(stageDimensions);
        this._clearCache();
    }

    onGridSizeChanged(gridSize : number) {
        this.projectService.changeGridSize(gridSize);
        this._clearCache();
    }

    onScaleChanged(scale : number) {
        this.scale = scale;
        this._clearCache();
    }

    onShowGridChanged(showGrid : boolean) {
        this.showGrid = showGrid;
        this._clearCache();
    }

    async openMap(mapKey : string) {
        await this.projectService.openMap(mapKey);
        this._clearCache();
    }

    private _redrawAllDisplayObjects() {
        if (this._drawnConstructCache.length === 0) {
            let drawnConstructs : DrawnConstruct[] = [];
            drawnConstructs = drawnConstructs.concat(this._buildCanvasBackground());
            drawnConstructs = drawnConstructs.concat(this._entityDrawerService.drawEntitySystem(this._entitySystemService.entitySystem.value));
            drawnConstructs = drawnConstructs.concat(this._buildGrid());
            drawnConstructs = drawnConstructs.concat(this.tool.drawTool(this.scale));
            this._drawnConstructCache = this._renderPriorityService.sortDrawnConstructs(drawnConstructs);
        }
        this._buildCanvasDisplayObject(this._drawnConstructCache);
    }

    private _buildCanvasBackground() : DrawnConstruct {
        let dimension = this.projectService.project.value.currentMap.dimension;
        let drawnConstruct = new CanvasBackgroundDrawnConstruct();
        drawnConstruct.layer = Number.NEGATIVE_INFINITY;
        drawnConstruct.dimension = dimension;
        return drawnConstruct;
    }

    private _buildGrid() : DrawnConstruct {
        if (!this.showGrid) {
            return new DrawnConstruct();
        }

        let drawnConstruct = new GridDrawnConstruct();
        drawnConstruct.layer = Number.POSITIVE_INFINITY;
        drawnConstruct.scale = this.scale;
        drawnConstruct.dimension = this.projectService.project.value.currentMap.dimension;
        drawnConstruct.gridSize = this.projectService.project.value.currentMap.gridSize;
        return drawnConstruct;
    }

    private _buildCanvasDisplayObject(layerDrawnConstructs : DrawnConstruct[][]) {
        let canvasDrawnElements = new Container();
        for (let drawnConstructs of layerDrawnConstructs) {
            this._addDrawnConstructsToContainer(drawnConstructs, canvasDrawnElements);
        }
        this.canvasDisplayObject = canvasDrawnElements;
    }

    private _addDrawnConstructsToContainer(drawnConstructs : DrawnConstruct[], container : Container) {
        let graphics = new Graphics();
        for (let drawnConstruct of drawnConstructs) {
            let displayObject = drawnConstruct.drawable(this._totalMillis);
            if (displayObject) {
                container.addChild(displayObject);
            }
            drawnConstruct.paint(graphics);
        }
        container.addChild(graphics);
    }

    private _setTool(tool : BaseTool) {
        this.tool = new BimodalTool(tool, this._toolService.getTool("MapMoveTool"), this._keyboardService);
    }

    private _clearCache() {
        this._drawnConstructCache = [];
    }
}

class CanvasBackgroundDrawnConstruct extends DrawnConstruct {
    dimension : Vector;

    paint(graphics : Graphics) {
        drawCanvasBackground(
            {x: 0, y: 0},
            this.dimension,
            graphics);
    }
}

class GridDrawnConstruct extends DrawnConstruct {
    scale : number;
    dimension : Vector;
    gridSize : number

    paint(graphics : Graphics) {
        graphics.lineStyle(1 / this.scale, 0xEEEEEE, 0.5);
        drawGrid(
            {x: 0, y: 0},
            this.dimension,
            {x: this.gridSize, y: this.gridSize},
            graphics);
        drawCanvasBorder(
            {x: 0, y: 0},
            this.dimension,
            graphics);
    }
}
