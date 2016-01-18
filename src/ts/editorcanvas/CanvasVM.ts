///<reference path="../framework/ViewModel.ts"/>
///<reference path="../entitysystem/core/EntitySystem.ts"/>
///<reference path="../entitysystem/core/Entity.ts"/>
///<reference path="../framework/command/Command.ts"/>
///<reference path="../entitysystem/components/drawing/DrawableComponent.ts"/>
///<reference path="../entitysystem/components/drawing/RectangleShape.ts"/>
module editorcanvas {
    import observe = framework.observe;

    /**
     * Contains the editor specific properties of the canvas.
     */
    class CanvasProperties extends observe.SimpleObservable {
        @observe.Primitive(Number)
        zoom : number = 100;

        @observe.Object()
        dimensions : math.Vector = new math.Vector();

        @observe.Primitive(Boolean)
        isGridVisible : boolean = true;
    }

    /**
     * ViewModel for the main canvas used to interact with entities.
     */
    export class CanvasVM extends framework.ViewModel<entityframework.EntitySystem> {
        private selectedEntity : entityframework.core.SelectedEntity;
        private project : framework.Project;
        private _stage : createjs.Stage;
        private entityDrawerService : services.EntityDrawerService;
        private grid : editorcanvas.drawing.Grid;
        private canvasDiv : HTMLDivElement;
        private scrollDiv : HTMLDivElement;
        private properties : CanvasProperties = new CanvasProperties();
        private eventsGivenToCanvas : string = "click mousedown mouseup mousemove";
        private toolService : services.ToolService;

        constructor() {
            super();

            this.properties.dimensions = new math.Vector(800, 500);
            this.grid = new editorcanvas.drawing.Grid(32, new math.Vector(800, 500));
        }

        onDataReady() {
            super.onDataReady();
            this.setChangeListener(this.data, () => this.redrawCanvas());
            this.setChangeListener(this.properties, () => {
                this.onStagePropertiesChanged();
                this.redrawCanvas();
            });
            this.setChangeListener(this.grid, () => {
                this.grid.constructGrid();
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
            this.project = this._context.getSharedObject(framework.Project);
            this.toolService = this._context.getSharedObject(editorcanvas.services.ToolService);
            this._context.setSharedObject(this.data);
        }

        private buildBackgroundChild() : createjs.DisplayObject {
            var background = new createjs.Shape();
            background.x = -(this.properties.dimensions.x / 2);
            background.y = -(this.properties.dimensions.y / 2);
            background.graphics.beginFill("White").drawRect(0, 0, this.properties.dimensions.x, this.properties.dimensions.y);
            return background;
        }

        private clear() {
            this.stage.removeAllChildren();
            this.stage.addChild(this.buildBackgroundChild());
        }

        private load() {
            this._context.systemLoader.loadMap(this.project.projectName, this.data.getEmptyClone())
                .then((entitySystem : entityframework.EntitySystem) => {
                    this.changeData(entitySystem);
                    this._context.getSharedObject(util.resource.ResourceManager).loadAssets(
                        this.data.collectAssets(),
                        this._context.getSharedObjectByKey("Project").rootPath);
                }, framework.error.onPromiseError(this._context));
        }

        private changeData(newData : entityframework.EntitySystem) {
            this._context.commandQueue.clear();
            this.selectedEntity.entityKey = "";
            this.data.move(newData);

            /* temp default camera */
            if (!this.data.getEntity("screenCam")) {
                var screenCamEntity = new entityframework.Entity();
                screenCamEntity.addComponent("camera",
                    new entityframework.components.CameraComponent(new math.Vector(800, 600), 1, 0, true));
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
            this.entityDrawerService = this._context.getSharedObject(services.EntityDrawerService);
        }

        private setupDelegates() {
            $(this.findById("canvas-view")).on(
                this.eventsGivenToCanvas,
                (event) => util.html.passMouseEventToElement(event.originalEvent, this.findById("entity-canvas")));

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
            var newDimensions = new math.Vector(
                Math.max(this.canvasDiv.clientWidth, this.properties.dimensions.x * (this.properties.zoom / 100)),
                Math.max(this.canvasDiv.clientHeight, this.properties.dimensions.y * (this.properties.zoom / 100)));
            if (!(newDimensions.x === this.grid.canvasDimensions.x && newDimensions.y === this.grid.canvasDimensions.y)) {
                this.grid.canvasDimensions = newDimensions;
            }
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
            return new math.Vector(
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
            if (!this._context.getSharedObject(util.resource.ResourceManager).areAllResourcesLoaded()) {
                return;
            }

            this.disableInterpolation();
            this.clear();
            this.addDrawnElementsToStage();
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
            var entitiesByPriority = this._context.getSharedObject(services.EntityRenderSortService).getEntitiesByPriority();
            entitiesByPriority.forEach((entityKey : string) => {
                var resourceManager = this._context.getSharedObject(util.resource.ResourceManager);
                toDraw.push(this.entityDrawerService.getEntityDisplayable(this.data.getEntity(entityKey)));
            });
            return toDraw;
        }

        /**
         * Adds the various elements that are drawn onto the canvas to the stage.
         * This includes entity's DrawableComponent drawables, collision bounds,
         * current tool graphical representation, etc.
         */
        private addDrawnElementsToStage() {
            this.collectEntityDrawables().forEach((drawnElement) =>
                this.stage.addChild(drawnElement));
            if (this.toolService.currentTool.getDisplayObject()) {
                this.stage.addChild(this.toolService.currentTool.getDisplayObject());
            }
            if (this.properties.isGridVisible) {
                this.stage.addChild(this.grid.getDrawable(new math.Vector(0, 0)));
            }
        }

        /**
         * @see ViewModel.viewFile
         */
        get viewFile() : string {
            return "canvas";
        }

        get stage() : createjs.Stage {
            return this._stage;
        }
    }
}
