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

const BACKGROUND_CACHE_KEY = "background";
const ENTITIES_CACHE_KEY = "entities";
const GRID_CACHE_KEY = "grid";
const TOOL_CACHE_KEY = "tool";
// this cache controls the order in which the drawables on the map editor are drawn
const CACHE_KEYS : string[] = [BACKGROUND_CACHE_KEY, ENTITIES_CACHE_KEY, GRID_CACHE_KEY, TOOL_CACHE_KEY];

type DrawableCache = {
    displayObject : DisplayObject;
    graphics? : Graphics;
    dirty: boolean;
}

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
    private _drawableCache : {[key : string] : DrawableCache} = {};

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
                private _entityLayerService : EntityLayerService) {
        this._setTool(this._toolService.defaultTool);
    }

    ngOnInit() {
        this._initCache();
        this._drawerServiceSubscription = this._entityDrawerService.invalidateDrawableCache.subscribe(() => {
            this._markCacheDirty(ENTITIES_CACHE_KEY);
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
        this._markCacheDirty(TOOL_CACHE_KEY)
    }

    onStageDimensonsChanged(stageDimensions : Vector) {
        this.projectService.changeDimension(stageDimensions);
        this._markCacheDirty(BACKGROUND_CACHE_KEY);
        this._markCacheDirty(GRID_CACHE_KEY);
    }

    onGridSizeChanged(gridSize : number) {
        this.projectService.changeGridSize(gridSize);
        this._markCacheDirty(GRID_CACHE_KEY);
    }

    onScaleChanged(scale : number) {
        this.scale = scale;
        this._markAllCachesDirty();
    }

    onShowGridChanged(showGrid : boolean) {
        this.showGrid = showGrid;
        this._markCacheDirty(GRID_CACHE_KEY);
    }

    async openMap(mapKey : string) {
        await this.projectService.openMap(mapKey);
        this._markAllCachesDirty();
    }

    private _redrawAllDisplayObjects() {
        if (this._drawableCache[BACKGROUND_CACHE_KEY].dirty) {
            this._resetCacheDrawables(BACKGROUND_CACHE_KEY);
            this._markCacheActive(BACKGROUND_CACHE_KEY);

            this._buildCanvasBackground(this._drawableCache[BACKGROUND_CACHE_KEY].graphics);
        }
        if (this._drawableCache[ENTITIES_CACHE_KEY].dirty) {
            this._resetCacheDrawables(ENTITIES_CACHE_KEY);
            this._markCacheActive(ENTITIES_CACHE_KEY);

            let drawnConstructs = this._entityDrawerService.drawEntitySystem(this._entitySystemService.entitySystem.value);
            this._drawableCache[ENTITIES_CACHE_KEY].displayObject = this._createEntitiesDisplayObject(drawnConstructs, this._totalMillis, this._drawableCache[ENTITIES_CACHE_KEY].graphics);
        }
        if (this._drawableCache[GRID_CACHE_KEY].dirty) {
            this._resetCacheDrawables(GRID_CACHE_KEY);
            this._markCacheActive(GRID_CACHE_KEY);

            this._buildGrid(this._drawableCache[GRID_CACHE_KEY].graphics);
        }
        if (this._drawableCache[TOOL_CACHE_KEY].dirty) {
            this._resetCacheDrawables(TOOL_CACHE_KEY);
            this._markCacheActive(TOOL_CACHE_KEY);

            this._drawableCache[TOOL_CACHE_KEY].displayObject = this.tool.getDisplayObject(this.scale);
        }

        this.canvasDisplayObject = this._buildCanvasDisplayObject();
    }

    private _buildCanvasBackground(graphics : Graphics) {
        let dimension = this.projectService.project.value.currentMap.dimension;
        drawCanvasBackground(
            {x: 0, y: 0},
            dimension,
            graphics);
    }

    private _buildGrid(graphics : Graphics) {
        if (!this.showGrid) {
            return;
        }

        graphics.lineStyle(1 / this.scale, 0xEEEEEE, 0.5);
        let dimension = this.projectService.project.value.currentMap.dimension;
        let gridSize = this.projectService.project.value.currentMap.gridSize;
        drawGrid(
            {x: 0, y: 0},
            dimension,
            {x: gridSize, y: gridSize},
            graphics);
        drawCanvasBorder(
            {x: 0, y: 0},
            dimension,
            graphics);
    }

    private _buildCanvasDisplayObject() : Container {
        let canvasDrawnElements = new Container();
        for (let cacheKey of CACHE_KEYS) {
            if (this._drawableCache[cacheKey].displayObject) {
                canvasDrawnElements.addChild(this._drawableCache[cacheKey].displayObject);
            }
            if (this._drawableCache[cacheKey].graphics) {
                canvasDrawnElements.addChild(this._drawableCache[cacheKey].graphics);
            }
        }
        return canvasDrawnElements;
    }

    private _createEntitiesDisplayObject(entitiesDrawnConstructs : DrawnConstruct[], totalMillis : number, graphics : Graphics) : DisplayObject {
        let entitiesDrawnContainer = new Container();
        for (let entityDisplayObject of displayObjectsForDrawnConstructs(entitiesDrawnConstructs, totalMillis, graphics)) {
            if (entityDisplayObject) {
                entitiesDrawnContainer.addChild(entityDisplayObject);
            }
        }
        entitiesDrawnContainer.interactiveChildren = false;
        return entitiesDrawnContainer;
    }

    private _setTool(tool : BaseTool) {
        this.tool = new BimodalTool(tool, this._toolService.getTool("MapMoveTool"), this._keyboardService);
    }

    private _initCache() {
        for (let cacheKey of CACHE_KEYS) {
            this._drawableCache[cacheKey] = {
                displayObject: null,
                graphics: new Graphics(),
                dirty: true
            };
        }
    }

    private _resetCacheDrawables(cacheKey : string) {
        this._drawableCache[cacheKey].displayObject = null;
        this._drawableCache[cacheKey].graphics.clear();
    }

    private _markCacheDirty(cacheKey : string) {
        this._drawableCache[cacheKey].dirty = true;
    }

    private _markAllCachesDirty() {
        for (let cacheKey of CACHE_KEYS) {
            this._markCacheDirty(cacheKey);
        }
    }

    private _markCacheActive(cacheKey : string) {
        this._drawableCache[cacheKey].dirty = false;
    }
}