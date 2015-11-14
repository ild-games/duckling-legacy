///<reference path="../../core/Component.ts"/>

module entityframework.components.drawing {

    import serialize = util.serialize;
    import observe = framework.observe;

    export class DrawableComponent extends Component {
        @observe.Primitive(String)
        private camEntity : string;

        @observe.Object()
        topDrawable : drawing.Drawable = null;
    }

    var DrawableTypeToFactory = {
        Container: new ContainerDrawableFactory(),
        Shape: new ShapeDrawableFactory()
    };

    class DrawableViewModel extends framework.ViewModel<DrawableComponent> implements framework.observe.Observer {
        private drawableTypeControl : controls.DrawableTypeControl;

        get viewFile() : string {
            return 'components/drawable';
        }

        constructor() {
            super();
        }

        onDataReady() {
            super.onDataReady();
            this.data.listenForChanges("data", this);
        }

        onViewReady() {
            super.onViewReady();
            this.drawableTypeControl = new controls.DrawableTypeControl(
                this,
                "selDrawableType",
                this.addDrawable);

            if (!this.data.topDrawable) {
                $(this.findById("divDrawableType")).removeClass("gone");
            } else {
                this.addTopDrawableVM(DrawableTypeToFactory[DrawableType[this.data.topDrawable.type]]);
            }
        }

        onDataChanged(key : string, event : framework.observe.DataChangeEvent) {
        }

        private addDrawable() {
            $(this.findById("divDrawableType")).addClass("gone");
            var drawableFactory = DrawableTypeToFactory[this.drawableTypeControl.pickedDrawable];
            if (drawableFactory) {
                this.data.topDrawable = drawableFactory.createDrawable("topDrawable");
                this.addTopDrawableVM(drawableFactory);
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

        createFormVM() : framework.ViewModel<any> {
            return new DrawableViewModel();
        }

        createComponent() : entityframework.Component {
            return new DrawableComponent();
        }
    }
}
