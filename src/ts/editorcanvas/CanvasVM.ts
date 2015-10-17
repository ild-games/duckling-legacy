///<reference path="../framework/ViewModel.ts"/>
///<reference path="../entitysystem/core/EntitySystem.ts"/>
///<reference path="../entitysystem/core/Entity.ts"/>
///<reference path="../framework/command/Command.ts"/>
///<reference path="../entitysystem/components/drawing/DrawableComponent.ts"/>
///<reference path="../entitysystem/components/drawing/RectangleShape.ts"/>
///<reference path="../editorcanvas/tools/Tool.ts"/>
///<reference path="../editorcanvas/tools/EntityCreatorTool.ts"/>
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

        constructor() {
            super();
            this.registerCallback("on-click", this.onClick);
            this.registerCallback("undo", this.undo);
            this.registerCallback("redo", this.redo);
            this.registerCallback("save", this.save);

            this.curTool = new editorcanvas.tools.EntityCreatorTool();
        }

        private selectRectangle(mousePos : math.Vector) {
            this.data.forEach((entity : entityframework.Entity, key : string) => {
                var position = entity.getComponent<comp.PhysicsComponent>("physics").info.position;
                var drawable = entity.getComponent<draw.DrawableComponent>("drawable");
                if (position && drawable) {
                    drawable.drawables.forEach((obj, drawableKey) => {
                        if (obj && (<draw.ShapeDrawable>obj).shape.contains(mousePos, position)) {
                            this._selectedEntity.entityKey = key;
                            return;
                        }
                    });
                }
            });
        }

        private onClick(event : MouseEvent, argument) {
            var mousePos = new math.Vector(event.offsetX, event.offsetY)
            if (event.ctrlKey || event.metaKey) {
                this.selectRectangle(mousePos);
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
            this.curTool.onBind(this._context, this);
            this.subscribeToolEvents();
            this.clear();
            this.load();
        }

        subscribeToolEvents() {
            this.stage.on("click", (event) => this.curTool.onEvent(event));
        }

        private redrawCanvas() {
            var toDraw : Array<drawing.CanvasDrawnElement> = [];
            toDraw = toDraw
                .concat(this.collectDrawables())
                .concat(this.collectCollisionBoundingBoxDrawables());

            this.clear();

            toDraw.forEach((drawnElement) =>
                this.stage.addChild(drawnElement.getDrawable()));

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
