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

        constructor() {
            super();
            this.registerCallback("on-click", this.onClick);
            this.registerCallback("undo", this.undo);
            this.registerCallback("redo", this.redo);
            this.registerCallback("clear", this.clear);

        }

        private selectRectangle(mousePos : math.Vector) {
            this.data.forEach((entity : entityframework.Entity, key : string) => {
                var position = entity.getComponent<comp.PhysicsComponent>("Physics").info.position;
                var shape = entity.getComponent<draw.DrawableComponent>("Drawable").getDrawable<draw.ShapeDrawable>("rectangle").shape;
                if (shape.contains(mousePos, position)) {
                    this._selectedEntity.entityKey = key;
                }
            });
        }

        private createRectangle(mousePos : math.Vector) {
            var rectEntity = new entityframework.Entity();
            var physComp = new comp.PhysicsComponent();
            var drawComp = new draw.DrawableComponent();
            var collisionComp = new comp.CollisionComponent();
            rectEntity.addComponent("Physics", physComp);
            rectEntity.addComponent("Drawable", drawComp);
            rectEntity.addComponent("Collision", collisionComp);
            physComp.info.position.x = mousePos.x;
            physComp.info.position.y = mousePos.y;

            drawComp.drawables.put(
                "rectangle",
                new draw.ShapeDrawable(new draw.RectangleShape(new math.Vector(20, 20))));
            collisionComp.info.dimensions.x = 15;
            collisionComp.info.dimensions.y = 15;
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

        onViewReady() {
            this._canvas = <HTMLCanvasElement>document.getElementById("entity-canvas");
            this._canvasContext = <CanvasRenderingContext2D>this._canvas.getContext("2d");
            this.data.listenForChanges("data", this);
            this._selectedEntity = this._context.getSharedObjectByKey("selectedEntity");
            this._selectedEntity.listenForChanges("selectedEntity", this);
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
            this.data.forEach(function(entity, key) {
                var posComp = entity.getComponent<comp.PhysicsComponent>("Physics");
                var drawComp  = entity.getComponent<draw.DrawableComponent>("Drawable");
                var shape  = <draw.RectangleShape>(drawComp.getDrawable<draw.ShapeDrawable>("rectangle").shape);

                var leftPoint = new drawing.CanvasPoint(
                    posComp.info.position.x - (shape.dimension.x / 2),
                    posComp.info.position.y - (shape.dimension.y /2));
                var rightPoint = new drawing.CanvasPoint(
                    leftPoint.x + shape.dimension.x, leftPoint.y + shape.dimension.y);

                newRectangles.push(new drawing.Rectangle(leftPoint, rightPoint));
            });
            return newRectangles;
        }

        private collectCollisionBoundingBoxDrawables() : Array<drawing.BoundingBox> {
            var newBoundingBoxes : Array<drawing.BoundingBox> = [];
            this.data.forEach(function(entity, key) {
                var posComp = entity.getComponent<comp.PhysicsComponent>("Physics");
                var collisionComp = entity.getComponent<comp.CollisionComponent>("Collision");

                var leftPoint = new drawing.CanvasPoint(
                    posComp.info.position.x - (collisionComp.info.dimensions.x / 2),
                    posComp.info.position.y - (collisionComp.info.dimensions.y / 2));
                var rightPoint = new drawing.CanvasPoint(
                    leftPoint.x + collisionComp.info.dimensions.x, leftPoint.y + collisionComp.info.dimensions.y);

                var color = "#000000";
                switch (collisionComp.info.bodyType)
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