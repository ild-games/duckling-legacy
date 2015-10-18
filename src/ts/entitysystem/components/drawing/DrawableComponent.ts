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
        private _curSelectedDrawable : string;
        private drawablePicker : controls.SelectControl;

        constructor() {
            super();
            this.registerCallback("delete-drawable", this.deleteDrawableFromSelect);
            this.registerCallback("add-drawable", this.addDrawableFromSelect);
        }

        deleteDrawableFromSelect() {
            if (this.data.getDrawable(this.drawablePicker.value)) {
                this._context.commandQueue.pushCommand(
                    new DeleteDrawableCommand(this.data, this.drawablePicker.value));
            }
        }

        addDrawableFromSelect() {
            this._context.commandQueue.pushCommand(
                new AddDrawableCommand(this.data, this.nextKey()));
        }

        onViewReady() {
            $(this.findById("drawableSelect")).on("change",(event) => this.drawableChangeHandler(event));
            this.drawablePicker = new controls.SelectControl(this.findById("drawableSelect"));
        }

        onDataReady() {
            this.data.listenForChanges("data", this);
            this.addDrawableViewModelOnStart();
        }

        addDrawableViewModelOnStart() {
            if (!this._curSelectedDrawable) {
                var drawableKeys = [];
                this.data.drawables.forEach((obj, key) => {
                    drawableKeys.push(key);
                });
                if (drawableKeys.length > 0) {
                    this._curSelectedDrawable = drawableKeys[0];
                }
            }
            this.addSelectedDrawableVM(this._curSelectedDrawable);
        }

        onDataChanged(key : string, event : framework.observe.DataChangeEvent) {
            switch (key) {
                case "data":
                    this.onDataObjChanged(event);
                    break;
            }
        }

        onDataObjChanged(event : framework.observe.DataChangeEvent) {
            if (event.name === "ChildModified") {
                setTimeout(() => this.onDataObjChildModified(event));
            }
        }

        onDataObjChildModified(event : framework.observe.DataChangeEvent) {
            this.drawablePicker.update();

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
            if (this.data.getDrawable(removedDrawableKey)) {
                this.addSelectedDrawableVM(removedDrawableKey);
            }
        }

        onDrawableAdded(addedDrawableKey : string) {
            this.removeChildViews();
            if (this.data.getDrawable(addedDrawableKey)) {
                this.drawablePicker.value = addedDrawableKey;;
                this.addSelectedDrawableVM(addedDrawableKey);
            }
        }

        get viewFile() : string {
            return 'components/drawable';
        }

        private drawableChangeHandler(event) {
            this.addSelectedDrawableVM(event.target.value);
        }

        private addSelectedDrawableVM(rectName : string) {
            this._curSelectedDrawable = rectName;
            this.addChildView(
                "drawableVM",
                new RectangleShapeViewModel(),
                this.data.getDrawable(rectName));
        }

        private nextKey() : string {
            var key = 0;
            while (this.data.getDrawable("Rect" + key)) key++;
            return "Rect" + key;
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
