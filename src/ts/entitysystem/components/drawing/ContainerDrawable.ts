///<reference path="../../../util/JsonLoader.ts"/>
///<reference path="Drawable.ts"/>
module entityframework.components.drawing {

    import observe = framework.observe;
    import serialize = util.serialize;

    /**
     * Represents a drawable that can contain a collection of drawables.
     */
    @serialize.ProvideClass(Drawable, "ild::ContainerDrawable")
    export class ContainerDrawable extends Drawable {
        @observe.Object()
        private drawables : observe.ObservableArray<Drawable> = new observe.ObservableArray<Drawable>();

        constructor(key : string) {
            super(key);
        }

        addDrawable(drawable : Drawable) {
            this.drawables.push(drawable);
        }

        removeDrawable(drawable : Drawable) {
            this.drawables.remove(drawable);
        }

        removeDrawableByKey(drawableKey : string) {
            var drawable = this.getDrawable(drawableKey);
            if (drawable) {
                this.removeDrawable(drawable);
            }
        }

        getDrawable(key : string) : Drawable {
            var toReturn = null;
            this.forEach((drawable) => {
                if (drawable.key === key) {
                    toReturn = drawable;
                }
            });
            return toReturn;
        }

        forEach(func : (object : Drawable) => void) {
            this.drawables.forEach(func);
        }

        getCanvasDisplayObject() : createjs.DisplayObject {
            return null;
        }
    }

    export class ContainerDrawableViewModel extends framework.ViewModel<ContainerDrawable> implements framework.observe.Observer {
        private drawablePicker : controls.SelectControl<Drawable>

        get viewFile() : string {
            return 'drawables/container_drawable';
        }

        constructor() {
            super();
            this.registerCallback("delete-drawable", this.deleteSelectedDrawable);
            this.registerCallback("add-drawable", this.addDrawable);
        }

        onViewReady() {
            super.onViewReady();
            this.drawablePicker = new controls.SelectControl<Drawable>(this, "drawableSelect", this.getDrawables(), "");
            this.drawablePicker.callback = (drawable) => this.addSelectedDrawableVM(drawable);
        }

        onDataReady() {
            super.onDataReady();
            this.data.listenForChanges("data", this);
        }

        onDataChanged(key : string, event : framework.observe.DataChangeEvent) {
            if (key === "data") {
                this.onDataObjChildModified(event);
            }
        }

        onDataObjChildModified(event : framework.observe.DataChangeEvent) {
            if (event.child.child) {
                switch (event.child.child.name) {
                    case "Removed":
                        this.onDrawableRemoved(this.drawablePicker.value);
                        break;
                    case "Added":
                        this.onDrawableAdded((<Drawable> event.child.child.data).key);
                        break;
                }
            }
        }

        onDrawableRemoved(removedDrawableKey : string) {
            this.removeChildViews();
            this.updateDrawablePicker();
        }

        onDrawableAdded(addedDrawableKey : string) {
            this.removeChildViews();
            if (this.data.getDrawable(addedDrawableKey)) {
                this.updateDrawablePicker();
                this.addSelectedDrawableVM(this.data.getDrawable(addedDrawableKey));
                this.drawablePicker.value = addedDrawableKey;
            }
        }

        deleteSelectedDrawable() {
            if (this.data.getDrawable(this.drawablePicker.value)) {
                this._context.commandQueue.pushCommand(
                    new DeleteDrawableCommand(this.data, this.drawablePicker.value));
            }
        }

        addDrawable() {
            this._context.commandQueue.pushCommand(
                new AddDrawableCommand(this.data, this.nextKey()));
        }

        private addSelectedDrawableVM(drawable : Drawable) {
            this.addChildView(
                "drawableVM",
                new RectangleShapeViewModel(),
                drawable);
        }

        private nextKey() : string {
            var key = 0;
            while (this.data.getDrawable("Rect" + key)) key++;
            return "Rect" + key;
        }

        private updateDrawablePicker() {
            this.drawablePicker.values = this.getDrawables();
        }

        private getDrawables() {
            var drawables : {[s:string] : Drawable} = {};
            this.data.forEach((drawable) => {
                drawables[drawable.key] = drawable;
            });
            return drawables;
        }
    }

    class DeleteDrawableCommand implements framework.command.Command {
        private _containerDrawable: ContainerDrawable;
        private _drawableName: string;
        private _drawable: Drawable;

        constructor(containerDrawable : ContainerDrawable, drawableName : string) {
            this._containerDrawable = containerDrawable;
            this._drawableName = drawableName;
        }

        execute() {
            this._drawable = this._containerDrawable.getDrawable(this._drawableName);
            if (this._drawable) {
                this._containerDrawable.removeDrawable(this._drawable);
            }
        }

        undo() {
            this._containerDrawable.addDrawable(this._drawable);
        }
    }

    class AddDrawableCommand implements framework.command.Command {
        private _containerDrawable: ContainerDrawable;
        private _drawableName: string;

        constructor(containerDrawable : ContainerDrawable, drawableName : string) {
            this._containerDrawable = containerDrawable;
            this._drawableName = drawableName;
        }

        execute() {
            this._containerDrawable.addDrawable(
                new ShapeDrawable(this._drawableName, new RectangleShape(new math.Vector(5, 5))));
        }

        undo() {
            this._containerDrawable.removeDrawableByKey(this._drawableName);
        }
    }

    export class ContainerDrawableFactory implements DrawableFactory {
        createFormVM() : framework.ViewModel<any> {
            return new ContainerDrawableViewModel();
        }

        createDrawable(key : string) : Drawable {
            return new ContainerDrawable(key);
        }
    }
}
