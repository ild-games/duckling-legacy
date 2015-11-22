///<reference path="../framework/ViewModel.ts"/>
///<reference path="../entitysystem/core/EntitySystem.ts"/>
///<reference path="../entitysystem/core/Entity.ts"/>
///<reference path="../framework/command/Command.ts"/>
///<reference path="../entitysystem/components/drawing/DrawableComponent.ts"/>
///<reference path="../entitysystem/components/drawing/RectangleShape.ts"/>
///<reference path="../editorcanvas/tools/Tool.ts"/>
module editorcanvas {
    import observe = framework.observe;

    class CanvasProperties extends observe.Observable {
        @observe.Primitive(Number)
        zoom : number = 100;

        @observe.Object()
        dimensions : math.Vector = new math.Vector();
    }

    /**
     * ViewModel for the main canvas used to interact with entities.
     */
    export class CanvasVM extends framework.ViewModel<entityframework.EntitySystem> implements framework.observe.Observer {
        private _selectedEntity : entityframework.core.SelectedEntity;
        private _project : framework.Project;
        private _systemLoader : entityframework.SystemLoader;
        private stage : createjs.Stage;
        private entityDrawerService : services.EntityDrawerService;
        private curTool : editorcanvas.tools.Tool;
        private createTool : editorcanvas.tools.EntityCreatorTool;
        private moveTool : editorcanvas.tools.EntityDragTool;
        private selectTool : editorcanvas.tools.EntitySelectTool;
        private mapMoveTool : editorcanvas.tools.MapDragTool;
        private grid : editorcanvas.drawing.Grid;
        private canvasDiv : HTMLDivElement;
        private scrollDiv : HTMLDivElement;

        private _properties : CanvasProperties = new CanvasProperties();

        constructor() {
            super();
            this.registerCallback("undo", this.undo);
            this.registerCallback("redo", this.redo);
            this.registerCallback("save", this.save);

            this.createTool = new editorcanvas.tools.EntityCreatorTool();
            this.moveTool = new editorcanvas.tools.EntityDragTool();
            this.selectTool = new editorcanvas.tools.EntitySelectTool();
            this.mapMoveTool = new editorcanvas.tools.MapDragTool();
            this.curTool = this.mapMoveTool;
            this.properties.dimensions = new math.Vector(800, 500);
            this.grid = new editorcanvas.drawing.Grid(32, new math.Vector(800, 500));
        }

        private changeTool() {
            switch ($(this.findById("toolSelect")).val()) {
                case "create":
                    this.curTool = this.createTool;
                    break;
                case "move":
                    this.curTool = this.moveTool;
                    break;
                case "select":
                    this.curTool = this.selectTool;
                    break;
                case "mapMove":
                    this.curTool = this.mapMoveTool;
                    break;
            }
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
            this.stage.addChild(this.grid.getDrawable(new math.Vector(0, 0)));
        }

        private save() {
            this._systemLoader.saveMap(this._project.projectName, this.data);
        }

        private load() {
            this._systemLoader.loadMap(this._project.projectName, this.data.getEmptyClone())
                .then((entitySystem : entityframework.EntitySystem) => {
                    this.changeData(entitySystem);
                });
        }

        private changeData(newData : entityframework.EntitySystem) {
            this._context.commandQueue.clear();
            this._selectedEntity.entityKey = "";
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

        onDataReady() {
            super.onDataReady();
            this.properties.listenForChanges("properties", this);
            this.grid.listenForChanges("grid", this);
        }

        onViewReady() {
            this.data.listenForChanges("data", this);

            this.entityDrawerService = this._context.getSharedObject(services.EntityDrawerService);

            this._selectedEntity = this._context.getSharedObjectByKey("selectedEntity");
            this._selectedEntity.listenForChanges("selectedEntity", this);

            this._project = this._context.getSharedObject(framework.Project);
            this._systemLoader =
                new entityframework.SystemLoader(this._project, new util.JsonLoader());
            this._context.setSharedObject(this.data);

            this.stage = new createjs.Stage(this.id("entity-canvas"));
            this.bindTools();
            this.subscribeToolEvents();
            $(this.findById("toolSelect")).change(() => this.changeTool());
            $(this.findById("canvas-view")).on("click mousedown mouseup mousemove", (event) => {
                this.findById("entity-canvas").dispatchEvent(new MouseEvent(event.originalEvent.type, event.originalEvent));
            });
            $(this.findById("entity-canvas")).on("click mousedown mouseup mousemove", (event) => event.originalEvent.stopPropagation());
            this.canvasDiv = <HTMLDivElement>this.findById("canvas-view");
            this.scrollDiv = <HTMLDivElement>this.findById("canvas-scroll");
            $(this.findById("canvas-view")).on("scroll", (event) => this.scrolled());

            this._context.window.addEventListener("resize", () => this.windowResized());

            this.redrawCanvas();
            this.load();
        }

        private scrolled() {
            this.setStagePosition();
            this.stage.update();
        }

        private windowResized() {
            var canvas = <HTMLCanvasElement>this.stage.canvas;
            canvas.width = this.canvasDiv.clientWidth;
            canvas.height = this.canvasDiv.clientHeight;
            this.updateGrid();
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

        private bindTools() {
            this.createTool.onBind(this._context, this);
            this.moveTool.onBind(this._context, this);
            this.selectTool.onBind(this._context, this);
            this.mapMoveTool.onBind(this._context, this);
            this.mapMoveTool.draggedElement = this.findById("canvas-view");
        }

        private subscribeToolEvents() {
            this.stage.on("click", (event) => this.curTool.onEvent(event));
            this.stage.on("stagemousedown", (event) => this.curTool.onEvent(event));
            this.stage.on("stagemouseup", (event) => this.curTool.onEvent(event));
            this.stage.on("stagemousemove", (event) => this.curTool.onEvent(event));
        }

        private setStagePosition() {
            var newDimensions = new math.Vector(
                this.properties.dimensions.x * this.stage.scaleX,
                this.properties.dimensions.y * this.stage.scaleY);

            this.scrollDiv.style.width = newDimensions.x + "px";
            this.scrollDiv.style.height = newDimensions.y + "px";
            this.stage.x = Math.max(newDimensions.x / 2, this.canvasDiv.clientWidth / 2) - this.canvasDiv.scrollLeft;
            this.stage.y = Math.max(newDimensions.y / 2, this.canvasDiv.clientHeight / 2) - this.canvasDiv.scrollTop;
        }

        public redrawCanvas() {
            this.stage.scaleX = 1 * (this.properties.zoom / 100);
            this.stage.scaleY = 1 * (this.properties.zoom / 100);
            this.setStagePosition();
            this.updateGrid();

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

            this.stage.update();
        }


        onDataChanged(key:string, event:framework.observe.DataChangeEvent) {
            switch (key) {
                case "data":
                    this.redrawCanvas();
                    break;
                case "selectedEntity":
                    break;
                case "properties":
                    this.redrawCanvas();
                    break;
                case "grid":
                    this.grid.constructGrid();
                    this.redrawCanvas();
                    break;
            }
        }

        /**
         * @see ViewModel.viewFile
         */
        get viewFile() : string {
            return "canvas";
        }

        getStage() : createjs.Stage {
            return this.stage;
        }

        get properties() : CanvasProperties {
            return this._properties;
        }
    }
}
