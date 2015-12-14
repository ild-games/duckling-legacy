///<reference path="../framework/ViewModel.ts"/>
///<reference path="../entitysystem/core/EntitySystem.ts"/>
///<reference path="../entitysystem/core/Entity.ts"/>
///<reference path="../framework/command/Command.ts"/>
///<reference path="../entitysystem/components/drawing/DrawableComponent.ts"/>
///<reference path="../entitysystem/components/drawing/RectangleShape.ts"/>
///<reference path="../editorcanvas/tools/Tool.ts"/>
module editorcanvas {
    import observe = framework.observe;

    /**
     * Contains the editor specific properties of the canvas.
     */
    class CanvasProperties extends observe.Observable {
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
    export class CanvasVM extends framework.ViewModel<entityframework.EntitySystem> implements framework.observe.Observer {
        private selectedEntity : entityframework.core.SelectedEntity;
        private project : framework.Project;
        private systemLoader : entityframework.SystemLoader;
        private _stage : createjs.Stage;
        private entityDrawerService : services.EntityDrawerService;
        private curTool : editorcanvas.tools.Tool;
        private tools : { [key : string] : editorcanvas.tools.BaseTool } = {};
        private grid : editorcanvas.drawing.Grid;
        private canvasDiv : HTMLDivElement;
        private scrollDiv : HTMLDivElement;
        private properties : CanvasProperties = new CanvasProperties();
        private eventsGivenToCanvas : string = "click mousedown mouseup mousemove";

        constructor() {
            super();
            this.registerCallback("undo", this.undo);
            this.registerCallback("redo", this.redo);
            this.registerCallback("save", this.save);

            this.properties.dimensions = new math.Vector(800, 500);
            this.grid = new editorcanvas.drawing.Grid(32, new math.Vector(800, 500));
        }

        onDataReady() {
            super.onDataReady();
            this.data.listenForChanges("data", this);
            this.properties.listenForChanges("properties", this);
            this.grid.listenForChanges("grid", this);
        }

        onViewReady() {
            super.onViewReady();
            this.subscribeToServices();
            this.setupDelegates();
            this.setupSharedObjects();
            this.addTools();
            this.setupStage();
            this.onStagePropertiesChanged();
            this.redrawCanvas();
            this.load();
        }

        onDataChanged(key:string, event:framework.observe.DataChangeEvent) {
            switch (key) {
                case "data":
                    this.redrawCanvas();
                    break;
                case "selectedEntity":
                    break;
                case "properties":
                    this.onStagePropertiesChanged();
                    this.redrawCanvas();
                    break;
                case "grid":
                    this.grid.constructGrid();
                    this.redrawCanvas();
                    break;
            }
        }

        private setupSharedObjects() {
            this.selectedEntity = this._context.getSharedObjectByKey("selectedEntity");
            this.selectedEntity.listenForChanges("selectedEntity", this);

            this.project = this._context.getSharedObject(framework.Project);
            this.systemLoader = new entityframework.SystemLoader(this.project, new util.JsonLoader());
            this._context.setSharedObject(this.data);
        }

        private addTools() {
            var createEntityTool = new editorcanvas.tools.EntityCreatorTool();
            this.addTool(createEntityTool);

            var selectEntityTool = new editorcanvas.tools.EntitySelectTool();
            this.addTool(selectEntityTool);

            var dragEntityTool = new editorcanvas.tools.EntityDragTool();
            this.addTool(dragEntityTool);

            var mapMoveTool = new editorcanvas.tools.MapDragTool();
            mapMoveTool.draggedElement = this.findById("canvas-view");
            this.addTool(mapMoveTool);

            this.curTool = createEntityTool;
        }

        private addTool(tool : editorcanvas.tools.BaseTool) {
            this.tools[tool.key] = tool;
            tool.onBind(this._context, this);
            util.jquery.addOptionToSelect($(this.findById("toolSelect")), tool.key, tool.label);
        }

        private undo() {
            this._context.commandQueue.undo();
        }

        private redo() {
            this._context.commandQueue.redo();
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

        private save() {
            this.systemLoader.saveMap(this.project.projectName, this.data);
        }

        private load() {
            this.systemLoader.loadMap(this.project.projectName, this.data.getEmptyClone())
                .then((entitySystem : entityframework.EntitySystem) => {
                    this.changeData(entitySystem);
                }, framework.error.onPromiseError(this._context));
        }

        private changeData(newData : entityframework.EntitySystem) {
            this._context.commandQueue.clear();
            this.selectedEntity.entityKey = "";
            this.data.move(newData);
            this.clear();
            this.redrawCanvas();

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
            $(this.findById("toolSelect")).change(() => this.curTool = this.tools[$(this.findById("toolSelect")).val()]);

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
            this.stage.on("click", (event) => this.curTool.onEvent(event));
            this.stage.on("stagemousedown", (event) => this.curTool.onEvent(event));
            this.stage.on("stagemouseup", (event) => this.curTool.onEvent(event));
            this.stage.on("stagemousemove", (event) => this.curTool.onEvent(event));
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

        public redrawCanvas() {

            var toDraw : Array<createjs.DisplayObject> = [];

            this.data.forEach((entity) => {
                toDraw.push(this.entityDrawerService.getEntityDisplayable(entity));
            });

            this.clear();

            toDraw.forEach((drawnElement) =>
                this.stage.addChild(drawnElement));
            if (this.curTool.getDisplayObject()) {
                this.stage.addChild(this.curTool.getDisplayObject());
            }
            if (this.properties.isGridVisible) {
                this.stage.addChild(this.grid.getDrawable(new math.Vector(0, 0)));
            }

            this.stage.update();
        }


        get viewFile() : string {
            return "canvas";
        }

        get stage() : createjs.Stage {
            return this._stage;
        }
    }
}
