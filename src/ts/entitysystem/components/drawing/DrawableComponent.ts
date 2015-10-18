///<reference path="../../core/Component.ts"/>

module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    export class DrawableComponent extends Component {
        @observe.Primitive()
        private camEntity : string;

        @observe.Object()
        drawables : framework.observe.ObservableMap<Drawable>;

        constructor() {
            super();
            this.drawables = new framework.observe.ObservableMap<Drawable>();
        }

        getDrawable<T extends Drawable>(key:string) : T {
            return <T>this.drawables.get(key);
        }

    }

    class DrawableViewModel extends framework.ViewModel<DrawableComponent> implements framework.observe.Observer {
        private drawablePicker : controls.SelectControl<Drawable>;

        constructor() {
            super();
            this.registerCallback("delete-drawable", this.deleteSelectedDrawable);
            this.registerCallback("add-drawable", this.addDrawable);
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

        onViewReady() {
            this.drawablePicker = new controls.SelectControl<Drawable>(this, "drawableSelect", this.getDrawables(), "");
            this.drawablePicker.callback = (drawable) => this.addSelectedDrawableVM(drawable);
        }

        onDataReady() {
            this.data.listenForChanges("data", this);
        }

        onDataChanged(key : string, event : framework.observe.DataChangeEvent) {
            if (key === "data") {
                this.onDataObjChildModified(event);;
            }
        }

        onDataObjChildModified(event : framework.observe.DataChangeEvent) {
            switch (event.child.name) {
                case "Removed":
                    this.onDrawableRemoved(this.drawablePicker.value);
                    break;
                case "Added":
                    this.onDrawableAdded((<Drawable> event.child.data).key);
                    break;
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
                this.drawablePicker.value = addedDrawableKey;;
            }
        }

        get viewFile() : string {
            return 'components/drawable';
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
            this.data.drawables.forEach((drawable, name) => {
                drawables[name] = drawable;
            });
            return drawables;;
        }
    }

    export class DrawableComponentFactory implements ComponentFactory {

        get displayName() {
            return "Drawable";
        }

        get name() {
            return "drawable";
        }

        get componentConstructor() {
            return DrawableComponent;
        }

        createFormVM():framework.ViewModel<any> {
            return new DrawableViewModel();
        }

        createComponent():entityframework.Component {
            return new DrawableComponent();
        }
    }

    class DeleteDrawableCommand implements framework.command.Command {
        private _drawableComp: DrawableComponent;
        private _drawableName: string;
        private _drawable: Drawable;

        constructor(drawableComp : DrawableComponent, drawableName : string) {
            this._drawableComp = drawableComp;
            this._drawableName = drawableName;
        }

        execute() {
            this._drawable = this._drawableComp.getDrawable(this._drawableName);
            this._drawableComp.drawables.remove(this._drawableName);
        }

        undo() {
            this._drawableComp.drawables.put(this._drawableName, this._drawable);
        }
    }

    class AddDrawableCommand implements framework.command.Command {
        private _drawableComp: DrawableComponent;
        private _drawableName: string;

        constructor(drawableComp : DrawableComponent, drawableName : string) {
            this._drawableComp = drawableComp;
            this._drawableName = drawableName;
        }

        execute() {
            this._drawableComp.drawables.put(
                this._drawableName,
                new ShapeDrawable(new RectangleShape(new math.Vector(5, 5)), this._drawableName));
        }

        undo() {
            this._drawableComp.drawables.remove(this._drawableName);
        }
    }
}
