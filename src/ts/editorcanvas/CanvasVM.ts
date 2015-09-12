///<reference path="../framework/ViewModel.ts"/>
///<reference path="../entitysystem/core/EntitySystem.ts"/>
///<reference path="../entitysystem/core/Entity.ts"/>
///<reference path="../framework/command/Command.ts"/>
///<reference path="../entitysystem/components/drawing/DrawableComponent.ts"/>
///<reference path="../entitysystem/components/drawing/RectangleShape.ts"/>
module editorcanvas {

    import draw = entityframework.components.drawing;
    import comp = entityframework.components;

    class AddEntityCommand implements framework.command.Command {
        private _es : entityframework.EntitySystem;
        private _entity : entityframework.Entity;
        private _entityId : string;

        constructor(es : entityframework.EntitySystem, entity : entityframework.Entity) {
            this._es = es;
            this._entity = entity;
            this._entityId = this._es.nextKey();
        }

        execute() {
            this._es.addEntity(this._entityId, this._entity);
        }

        undo() {
            this._es.removeEntity(this._entityId);
        }
    }


    /**
     * ViewModel for the main canvas used to interact with entities.
     */
    export class CanvasVM extends framework.ViewModel<entityframework.EntitySystem> implements framework.observe.Observer {
        private _canvas : HTMLCanvasElement;
        private _canvasContext : CanvasRenderingContext2D;
        private _selectedEntity : entityframework.core.SelectedEntity;
        private _project : framework.Project;
        private _systemLoader : entityframework.SystemLoader;

        constructor() {
            super();
            this.registerCallback("on-click", this.onClick);
            this.registerCallback("undo", this.undo);
            this.registerCallback("redo", this.redo);
            this.registerCallback("save", this.save);
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

        private createRectangle(mousePos : math.Vector) {
            var rectEntity = new entityframework.Entity();
            var physComp = new comp.PhysicsComponent();
            var drawComp = new draw.DrawableComponent();
            var collisionComp = new comp.CollisionComponent();
            rectEntity.addComponent("physics", physComp);
            rectEntity.addComponent("drawable", drawComp);
            rectEntity.addComponent("collision", collisionComp);
            physComp.info.position.x = mousePos.x;
            physComp.info.position.y = mousePos.y;

            drawComp.drawables.put(
                "Rect0",
                new draw.ShapeDrawable(new draw.RectangleShape(new math.Vector(20, 20)), "Rect1"));
            collisionComp.info.dimension.x = 15;
            collisionComp.info.dimension.y = 15;
            this._context.commandQueue.pushCommand(new AddEntityCommand(this.data, rectEntity));
        }

        private onClick(event : MouseEvent, argument) {
            var mousePos = new math.Vector(event.offsetX, event.offsetY)
            if (event.ctrlKey || event.metaKey) {
                this.selectRectangle(mousePos);
            } else {
                this.createRectangle(mousePos);
            }
        }

        private undo() {
            this._context.commandQueue.undo();
        }

        private redo() {
            this._context.commandQueue.redo();
        }

        private clear() {
            this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._canvasContext.beginPath();
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
            this._canvas = <HTMLCanvasElement>document.getElementById("entity-canvas");
            this._canvasContext = <CanvasRenderingContext2D>this._canvas.getContext("2d");
            this.data.listenForChanges("data", this);
            this._selectedEntity = this._context.getSharedObjectByKey("selectedEntity");
            this._selectedEntity.listenForChanges("selectedEntity", this);

            this._project = this._context.getSharedObject(framework.Project);
            this._systemLoader =
                new entityframework.SystemLoader(this._project, new util.JsonLoader());

            this.load();
        }

        private redrawCanvas() {
            var toDraw : Array<drawing.CanvasDrawnElement> = [];
            toDraw = toDraw
                .concat(this.collectDrawables())
                .concat(this.collectCollisionBoundingBoxDrawables());

            this.clear();
            toDraw.forEach((drawnElement) => drawnElement.draw(this._canvasContext));
            this._canvasContext.stroke();
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