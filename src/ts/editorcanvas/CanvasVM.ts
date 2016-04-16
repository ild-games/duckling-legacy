import SelectedEntity from '../entitysystem/core/SelectedEntity';
import RivetsViewModel from '../framework/RivetsViewModel';
import Project from '../framework/project/Project';
import {onPromiseError} from '../framework/error/ErrorHandler';
import SimpleObservable from '../framework/observe/SimpleObservable';
import {ObservePrimitive, ObserveObject} from '../framework/observe/ObserveDecorators';
import {CameraComponent} from '../entitysystem/components/CameraComponent';
import {Entity} from  '../entitysystem/core/Entity';
import {EntitySystem} from '../entitysystem/core/EntitySystem';
import SystemLoader from '../entitysystem/core/SystemLoader';
import ResourceManager from '../entitysystem/ResourceManager';
import Vector from '../math/Vector';
import {passMouseEventToElement} from '../util/HTMLUtils';
import EntityDrawerService from './services/EntityDrawerService';
import ToolService from './services/ToolService';
import EntityRenderSortService from './services/EntityRenderSortService';
import Grid from './drawing/Grid';

/**
 * Contains the editor specific properties of the canvas.
 */
class CanvasProperties extends SimpleObservable {
    @ObservePrimitive(Number)
    zoom : number = 100;

    @ObserveObject()
    dimensions : Vector = new Vector();

    @ObservePrimitive(Boolean)
    isGridVisible : boolean = true;
}

/**
 * RivetsViewModel for the main canvas used to interact with entities.
 */
export default class CanvasVM extends RivetsViewModel<EntitySystem> {
    private selectedEntity : SelectedEntity;
    private project : Project;
    private _stage : createjs.Stage;
    private entityDrawerService : EntityDrawerService;
    private grid : Grid;
    private canvasDiv : HTMLDivElement;
    private scrollDiv : HTMLDivElement;
    private properties : CanvasProperties = new CanvasProperties();
    private eventsGivenToCanvas : string = "click mousedown mouseup mousemove";
    private toolService : ToolService;
    private gridColor : string = "#cacaca";
    private systemLoader : SystemLoader;

    constructor() {
        super();

        this.properties.dimensions = new Vector(800, 500);
        this.grid = new Grid(32, new Vector(800, 500));
    }

    onDataReady() {
        super.onDataReady();
        this.setChangeListener(this.data, () => this.redrawCanvas());
        this.setChangeListener(this.properties, () => {
            this.onStagePropertiesChanged();
            this.redrawCanvas();
        });
        this.setChangeListener(this.grid, () => {
            this.grid.constructGrid(this.gridColor);
            this.redrawCanvas();
        });
    }

    onViewReady() {
        super.onViewReady();
        this.subscribeToServices();
        this.setupDelegates();
        this.setupSharedObjects();
        this.setupStage();
        this.onStagePropertiesChanged();
        this.load();
    }

    private setupSharedObjects() {
        this.selectedEntity = this._context.getSharedObjectByKey("selectedEntity");
        this.project = this._context.getSharedObject(Project);
        this.toolService = this._context.getSharedObject(ToolService);
        this.systemLoader = this._context.getSharedObject(SystemLoader);
        this._context.setSharedObject(this.data);
    }

    private buildBackgroundChild() : createjs.DisplayObject {
        var background = new createjs.Shape();
        background.x = -(this.properties.dimensions.x / 2) + 0.5;
        background.y = -(this.properties.dimensions.y / 2) + 0.5;
        background.shadow = new createjs.Shadow(this.gridColor, 0, 0, 5);
        background.graphics
            .setStrokeStyle(1, 0, 0, 10, true)
            .beginStroke(this.gridColor)
            .beginFill("White")
            .drawRect(0, 0, this.properties.dimensions.x, this.properties.dimensions.y);
        return background;
    }

    private clear() {
        this.stage.removeAllChildren();
        this.stage.addChild(this.buildBackgroundChild());
    }

    private load() {
        this.systemLoader.loadMap(this.project.projectName, this.data.getEmptyClone())
            .then((entitySystem : EntitySystem) => {
                this.changeData(entitySystem);
                this._context.getSharedObject(ResourceManager).loadAssets(
                    this.data.collectAssets(),
                    this._context.getSharedObjectByKey("Project").rootPath);
            }, onPromiseError(this._context));
    }

    private changeData(newData : EntitySystem) {
        this._context.commandQueue.clear();
        this.selectedEntity.entityKey = "";
        this.data.move(newData);

        /* temp default camera */
        if (!this.data.getEntity("screenCam")) {
            var screenCamEntity = new Entity();
            screenCamEntity.addComponent("camera",
                new CameraComponent(new Vector(800, 600), 1, 0, true));
            this.data.addEntity("screenCam", screenCamEntity);
        }
    }

    private setupStage() {
        this._stage = new createjs.Stage(this.id("entity-canvas"));

        this.subscribeToolEvents();
        this.canvasDiv = <HTMLDivElement>this.findById("canvas-view");
        this.scrollDiv = <HTMLDivElement>this.findById("canvas-scroll");
    }

    private subscribeToServices() {
        this.entityDrawerService = this._context.getSharedObject(EntityDrawerService);
    }

    private setupDelegates() {
        $(this.findById("canvas-view")).on(
            this.eventsGivenToCanvas,
            (event) => passMouseEventToElement(event.originalEvent, this.findById("entity-canvas")));

        $(this.findById("entity-canvas")).on(
            this.eventsGivenToCanvas,
            (event) => event.originalEvent.stopPropagation());

        $(this.findById("canvas-view")).on("scroll", (event) => this.scrolled());

        this._context.window.addEventListener("resize", () => this.windowResized());
    }

    private scrolled() {
        this.updateStagePosition();
        this.stage.update();
    }

    private windowResized() {
        var canvas = <HTMLCanvasElement>this.stage.canvas;
        canvas.width = this.canvasDiv.clientWidth;
        canvas.height = this.canvasDiv.clientHeight;
        this.onStagePropertiesChanged();
        this.redrawCanvas();
    }

    private updateGrid() {
        this.grid.canvasDimensions = new Vector(this.properties.dimensions.x, this.properties.dimensions.y);
    }

    private subscribeToolEvents() {
        this.stage.on("click", (event) => this.toolService.currentTool.onEvent(event, this));
        this.stage.on("stagemousedown", (event) => this.toolService.currentTool.onEvent(event, this));
        this.stage.on("stagemouseup", (event) => this.toolService.currentTool.onEvent(event, this));
        this.stage.on("stagemousemove", (event) => this.toolService.currentTool.onEvent(event, this));
    }

    private onStagePropertiesChanged() {
        this.stage.scaleX = 1 * (this.properties.zoom / 100);
        this.stage.scaleY = 1 * (this.properties.zoom / 100);

        var newDimensions = this.calculateStageDimensions();
        this.scrollDiv.style.width = newDimensions.x + "px";
        this.scrollDiv.style.height = newDimensions.y + "px";

        this.updateStagePosition();
        this.updateGrid();
    }

    private calculateStageDimensions() {
        return new Vector(
            this.properties.dimensions.x * this.stage.scaleX,
            this.properties.dimensions.y * this.stage.scaleY);
    }

    private updateStagePosition() {
        var newDimensions = this.calculateStageDimensions();
        this.stage.x = Math.max(newDimensions.x / 2, this.canvasDiv.clientWidth / 2) - this.canvasDiv.scrollLeft;
        this.stage.y = Math.max(newDimensions.y / 2, this.canvasDiv.clientHeight / 2) - this.canvasDiv.scrollTop;
    }

    /**
     * Called every time the canvas needs to be updated and redrawn.
     */
    redrawCanvas() {
        if (!this._context.getSharedObject(ResourceManager).areAllResourcesLoaded()) {
            return;
        }

        this.disableInterpolation();
        this.clear();
        this.stage.addChild(this.collectDrawnElementsIntoContainer());
        this.stage.update();
    }

    /**
     * Disables interpolation so scaling is done via the nearest neighbor approach.
     */
    private disableInterpolation() {
        var context : any = (<HTMLCanvasElement>this._stage.canvas).getContext("2d");
        context.imageSmoothingEnabled = false;
    }

    /**
     * Collect the entity's DrawableComponent's drawables into a flat array
     * that is sorted by the render priorities of the drawables.
     */
    private collectEntityDrawables() : Array<createjs.DisplayObject> {
        var toDraw : Array<createjs.DisplayObject> = [];
        var entitiesByPriority = this._context.getSharedObject(EntityRenderSortService).getEntitiesByPriority();
        entitiesByPriority.forEach((entityKey : string) => {
            var resourceManager = this._context.getSharedObject(ResourceManager);
            toDraw.push(this.entityDrawerService.getEntityDisplayable(this.data.getEntity(entityKey)));
        });
        return toDraw;
    }

    /**
     * Adds the various elements that are drawn onto the canvas to the stage.
     * This includes entity's DrawableComponent drawables, collision bounds,
     * current tool graphical representation, etc.
     */
    private collectDrawnElementsIntoContainer() : createjs.Container {
        var drawnElements = new createjs.Container();
        this.collectEntityDrawables().forEach((drawnElement) =>
            drawnElements.addChild(drawnElement));
        if (this.toolService.currentTool) {
            var toolDrawable = this.toolService.currentTool.getDisplayObject();
            if (toolDrawable) {
                drawnElements.addChild(toolDrawable);
            }
        }
        if (this.properties.isGridVisible) {
            drawnElements.addChild(this.grid.getDrawable(new Vector(0, 0)));
        }
        return drawnElements;
    }

    /**
     * @see RivetsViewModel.viewFile
     */
    get viewFile() : string {
        return "canvas";
    }

    get stage() : createjs.Stage {
        return this._stage;
    }
}
