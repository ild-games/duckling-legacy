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
        private _selectedEntity : entityframework.core.SelectedEntity;
        private _project : framework.Project;
        private _systemLoader : entityframework.SystemLoader;
        private stage : createjs.Stage;
        private entityDrawerService : services.EntityDrawerService;

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

            this.entityDrawerService = this._context.getSharedObject(services.EntityDrawerService);

            this._selectedEntity = this._context.getSharedObjectByKey("selectedEntity");
            this._selectedEntity.listenForChanges("selectedEntity", this);

            this._project = this._context.getSharedObject(framework.Project);
            this._systemLoader =
                new entityframework.SystemLoader(this._project, new util.JsonLoader());

            this.stage = new createjs.Stage(this.id("entity-canvas"));
            this.clear();
            this.load();
        }

        private redrawCanvas() {
            var toDraw : Array<createjs.DisplayObject> = [];

            this.data.forEach((entity) => {
                toDraw.push(this.entityDrawerService.getEntityDisplayable(entity));
            });

            this.clear();

            toDraw.forEach((drawnElement) =>
                this.stage.addChild(drawnElement));

            this.stage.update();
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
