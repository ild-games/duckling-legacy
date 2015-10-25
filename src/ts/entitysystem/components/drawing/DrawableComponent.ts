///<reference path="../../core/Component.ts"/>
/// <reference path="./ContainerDrawable.ts"/>
/// <reference path="./ShapeDrawable.ts"/>

module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    export class DrawableComponent extends Component {
        @observe.Primitive(String)
        private camEntity : string;

        @observe.Object()
        topDrawable : drawing.Drawable = null;
    }

    export enum DrawableType {
        Container,
        Shape
    }

    var DrawableTypeToFactory = {
        Container: new ContainerDrawableFactory(),
        Shape: new ShapeDrawableFactory()
    };

    class DrawableViewModel extends framework.ViewModel<DrawableComponent> implements framework.observe.Observer {
        private drawableTypePicker : controls.SelectControl<DrawableType>;

        get viewFile() : string {
            return 'components/drawable';
        }

        constructor() {
            super();
            this.registerCallback("add-drawable", this.addDrawable);
        }

        onDataReady() {
            super.onDataReady();
            this.data.listenForChanges("data", this);
        }

        onViewReady() {
            super.onViewReady();
            this.drawableTypePicker = new controls.SelectControl<DrawableType>(
                this,
                "selDrawableType",
                util.formatters.valuesFromEnum(DrawableType),
                DrawableType[DrawableType.Container]);

            if (!this.data.topDrawable) {
                $(this.findById("divDrawableType")).removeClass("gone");
            }
        }

        onDataChanged(key : string, event : framework.observe.DataChangeEvent) {
        }

        private addDrawable() {
            $(this.findById("divDrawableType")).addClass("gone");
            var drawableVM = DrawableTypeToFactory[this.drawableTypePicker.value];
            if (drawableVM) {
                this.data.topDrawable = drawableVM.createDrawable("topDrawable");
                this.addTopDrawableVM(drawableVM);
            }
        }

        private addTopDrawableVM(drawableFactory : framework.VMFactory) {
            if (this.data.topDrawable) {
                this.addChildView(
                    "drawableVM",
                    drawableFactory.createFormVM(),
                    this.data.topDrawable);
            }
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

        createFormVM() : framework.ViewModel<any> {
            return new DrawableViewModel();
        }

        createComponent() : entityframework.Component {
            return new DrawableComponent();
        }
    }
}
