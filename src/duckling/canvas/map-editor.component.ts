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

import {EntityDrawerService, EntityCache, DrawnConstruct} from './drawing';
import {RenderPriorityService} from './drawing/render-priority.service';
import {TopToolbarComponent, BottomToolbarComponent} from './_toolbars';
import {CanvasComponent} from './canvas.component';
import {drawRectangle, drawGrid, drawCanvasBorder, drawCanvasBackground} from './drawing/util';
import {BaseTool, ToolService, MapMoveTool, BimodalTool} from './tools';

type LayerCache = {
    graphics : Graphics;
    drawnConstructs : DrawnConstruct[]
};

type DrawableCache = {
    layers: LayerCache[];
    entityCache : EntityCache;
};

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
    private _drawingCache : DrawableCache = {layers: [], entityCache : {}};

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
        this._drawerServiceSubscription = this._entityDrawerService.redraw.subscribe((entityCacheValid) => {
            this._clearCache(entityCacheValid);
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
        let selections = this._selection.selections.value;
        this._copyPaste.copy(selections.map((selection: Selection) => { return selection.entity; }));
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
        // DEBUG, we need to clear the cache when dragging the selection box
        this._clearCache(true);
        // END DEBUG

        if (this._drawingCache.layers.length === 0) {
            let drawnConstructs : DrawnConstruct[] = [
                this._buildCanvasBackground(),
                ...this._entityDrawerService.drawEntitySystem(this._entitySystemService.entitySystem.value, this._drawingCache.entityCache),
                this._buildGrid(),
                this.tool.drawTool(this.scale)
            ];

            let layeredDrawnConstructs = this._renderPriorityService.sortDrawnConstructs(drawnConstructs);
            for (let layer = 0; layer < layeredDrawnConstructs.length; layer++) {
                this._drawingCache.layers[layer] = {
                    graphics: new Graphics(),
                    drawnConstructs: layeredDrawnConstructs[layer]
                };
            }
            this._paintDrawableCache();
        }
        this._buildCanvasDisplayObject();
    }

    private _buildCanvasBackground() : DrawnConstruct {
        let drawnConstruct = new CanvasBackgroundDrawnConstruct(this.projectService.project.value.currentMap.dimension);
        drawnConstruct.layer = Number.NEGATIVE_INFINITY;
        return drawnConstruct;
    }

    private _buildGrid() : DrawnConstruct {
        if (!this.showGrid) {
            return new DrawnConstruct();
        }

        let drawnConstruct = new GridDrawnConstruct(this.scale, this.projectService.project.value.currentMap.dimension, this.projectService.project.value.currentMap.gridSize);
        drawnConstruct.layer = Number.POSITIVE_INFINITY;
        return drawnConstruct;
    }

    private _buildCanvasDisplayObject() {
        let canvasDrawnElements = new Container();
        for (let layerCache of this._drawingCache.layers) {
            for (let drawnConstruct of layerCache.drawnConstructs) {
                let displayObject = drawnConstruct.draw(this._totalMillis);
                if (displayObject) {
                    canvasDrawnElements.addChild(displayObject);
                }
                canvasDrawnElements.addChild(layerCache.graphics);
            }
        }
        this.canvasDisplayObject = canvasDrawnElements;
    }

    private _paintDrawableCache() {
        for (let layerCache of this._drawingCache.layers) {
            for (let drawnConstruct of layerCache.drawnConstructs) {
                drawnConstruct.paint(layerCache.graphics);
            }
        }
    }

    private _setTool(tool : BaseTool) {
        this.tool = new BimodalTool(tool, this._toolService.getTool("MapMoveTool"), this._keyboardService);
    }

    private _clearCache(entityCacheValid : boolean = false) {
        this._drawingCache = {
            layers : [],
            entityCache : entityCacheValid ? this._drawingCache.entityCache : {}
        }
    }
}

class CanvasBackgroundDrawnConstruct extends DrawnConstruct {
    private _graphics = new Graphics();

    constructor(private _dimension : Vector) {
        super();
        drawCanvasBackground(
            {x: 0, y: 0},
            this._dimension,
            this._graphics);
        }

    draw(totalMillis : number) {
        return this._graphics;
    }
}

class GridDrawnConstruct extends DrawnConstruct {
    private _graphics = new Graphics();

    constructor(private _scale : number,
                private _dimension : Vector,
                private _gridSize : number) {
        super();

        this._graphics.lineStyle(1 / this._scale, 0xEEEEEE, 0.5);
        drawGrid(
            {x: 0, y: 0},
            this._dimension,
            {x: this._gridSize, y: this._gridSize},
            this._graphics);
        drawCanvasBorder(
            {x: 0, y: 0},
            this._dimension,
            this._graphics);
    }

    draw(totalMillis : number) {
        return this._graphics;
    }
}
