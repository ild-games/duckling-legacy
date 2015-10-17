///<reference path="../framework/ViewModel.ts"/>
///<reference path="../entitysystem/core/EntitySystem.ts"/>
///<reference path="../entitysystem/core/Entity.ts"/>
///<reference path="../framework/command/Command.ts"/>
///<reference path="../entitysystem/components/drawing/DrawableComponent.ts"/>
///<reference path="../entitysystem/components/drawing/RectangleShape.ts"/>
///<reference path="../editorcanvas/tools/Tool.ts"/>
module editorcanvas {

    import draw = entityframework.components.drawing;
    import comp = entityframework.components;


    /**
     * ViewModel for the main canvas used to interact with entities.
     */
    export class CanvasVM extends framework.ViewModel<entityframework.EntitySystem> implements framework.observe.Observer {
        private _selectedEntity : entityframework.core.SelectedEntity;
        private _project : framework.Project;
        private _systemLoader : entityframework.SystemLoader;
        private stage : createjs.Stage;
        private curTool : editorcanvas.tools.Tool;
        private createTool : editorcanvas.tools.EntityCreatorTool;
        private moveTool : editorcanvas.tools.EntityDragTool;
        private selectTool : editorcanvas.tools.EntitySelectTool;

        constructor() {
            super();
            this.registerCallback("undo", this.undo);
            this.registerCallback("redo", this.redo);
            this.registerCallback("save", this.save);

            this.createTool = new editorcanvas.tools.EntityCreatorTool();
            this.moveTool = new editorcanvas.tools.EntityDragTool();
            this.selectTool = new editorcanvas.tools.EntitySelectTool();
            this.curTool = this.createTool;
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
            }
        }

        private undo() {
            this._context.commandQueue.undo();
        }

        private redo() {
            this._context.commandQueue.redo();
        }

        private clear() {
            this.stage.removeAllChildren();
            var canvas = <HTMLCanvasElement>this.stage.canvas;
            var background = new createjs.Shape();
            background.graphics
                .beginFill("White")
                .drawRect(0,0,canvas.width,canvas.height);
            this.stage.addChild(background);
        }

        private save() {
            this._systemLoader.saveMap("testmap", this.data);
        }

        private load() {
            this._systemLoader.loadMap("testmap", this.data.getEmptyClone())
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
        }

        onViewReady() {
            this.data.listenForChanges("data", this);
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
            this.clear();
            this.load();
        }

        private bindTools() {
            this.createTool.onBind(this._context, this);
            this.moveTool.onBind(this._context, this);
            this.selectTool.onBind(this._context, this);
        }

        private subscribeToolEvents() {
            this.stage.on("click", (event) => this.curTool.onEvent(event));
            this.stage.on("stagemousedown", (event) => this.curTool.onEvent(event));
            this.stage.on("stagemouseup", (event) => this.curTool.onEvent(event));
            this.stage.on("stagemousemove", (event) => this.curTool.onEvent(event));
        }

        public redrawCanvas() {
            var toDraw : Array<drawing.CanvasDrawnElement> = [];
            toDraw = toDraw
                .concat(this.collectDrawables())
                .concat(this.collectCollisionBoundingBoxDrawables());

            this.clear();

            toDraw.forEach((drawnElement) =>
                this.stage.addChild(drawnElement.getDrawable()));
            if (this.curTool.getDisplayObject()) {
                this.stage.addChild(this.curTool.getDisplayObject());
            }

            this.stage.update();
        }

        private collectDrawables() : Array<drawing.Rectangle> {
            var newRectangles : Array<drawing.Rectangle> = [];
            this.data.forEach((entity, key) => {
                var posComp = entity.getComponent<comp.PhysicsComponent>("physics");
                var drawComp  = entity.getComponent<draw.DrawableComponent>("drawable");

                if (drawComp && posComp) {
                    drawComp.drawables.forEach((drawable, key) => {
                        var rect : drawing.Rectangle = this.makeCanvasRectangle(
                            posComp,
                            <draw.RectangleShape>(<draw.ShapeDrawable>(drawable)).shape);
                        newRectangles.push(rect);
                    });
                }
            });
            return newRectangles;
        }

        private makeCanvasRectangle(posComp : comp.PhysicsComponent, rect : draw.RectangleShape) : drawing.Rectangle {
            var leftPoint = new drawing.CanvasPoint(
                posComp.info.position.x - (rect.dimension.x / 2),
                posComp.info.position.y - (rect.dimension.y /2));
            var rightPoint = new drawing.CanvasPoint(
                leftPoint.x + rect.dimension.x, leftPoint.y + rect.dimension.y);

            return new drawing.Rectangle(leftPoint, rightPoint);
        }

        private collectCollisionBoundingBoxDrawables() : Array<drawing.BoundingBox> {
            var newBoundingBoxes : Array<drawing.BoundingBox> = [];
            this.data.forEach(function(entity, key) {
                var posComp = entity.getComponent<comp.PhysicsComponent>("physics");
                var collisionComp = entity.getComponent<comp.CollisionComponent>("collision");
                if (collisionComp && posComp) {
                    var leftPoint = new drawing.CanvasPoint(
                        posComp.info.position.x - (collisionComp.info.dimension.x / 2),
                        posComp.info.position.y - (collisionComp.info.dimension.y / 2));
                    var rightPoint = new drawing.CanvasPoint(
                        leftPoint.x + collisionComp.info.dimension.x, leftPoint.y + collisionComp.info.dimension.y);

                    var color = "#000000";
                    switch (collisionComp.bodyType)
                    {
                        case entityframework.components.CollisionBodyType.None:
                            color = "#0000ff"
                            break;
                        case entityframework.components.CollisionBodyType.Environment:
                            color = "#009900"
                            break;
                        case entityframework.components.CollisionBodyType.Solid:
                            color = "#ff0000"
                            break;
                    }

                    newBoundingBoxes.push(new drawing.BoundingBox(leftPoint, rightPoint, color));
                }
            });
            return newBoundingBoxes;
        }

        onDataChanged(key:string, event:framework.observe.DataChangeEvent) {
            switch (key) {
                case "data":
                    this.redrawCanvas();
                    break;
                case "selectedEntity":
                    break;
            }
        }

        /**
         * @see ViewModel.viewFile
         */
        get viewFile() : string {
            return "canvas";
        }
    }
}
