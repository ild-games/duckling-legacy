///<reference path="../../core/Component.ts"/>
module entityframework.components.drawing {

    import serialize = util.serialize;

    //TODO: Remove the ProvideClass decorator since Drawable components are not
    //polymorphic
    @serialize.ProvideClass(DrawableComponent, "ild::DrawableComponent")
    export class DrawableComponent extends Component {
        @serialize.Key("camEntity")
        private _camEntity : string;

        @serialize.Key("drawables")
        private _drawables : framework.observe.ObservableMap<Drawable>;

        constructor() {
            super();
            this._drawables = new framework.observe.ObservableMap<Drawable>();
            this._drawables.listenForChanges("drawables", this);
        }

        getDrawable<T extends Drawable>(key:string) : T {
            return <T>this.drawables.get(key);

        }

        get camEntity():string {
            this.dataChanged("camEntity", this);
            return this._camEntity;
        }

        set camEntity(value:string) {
            this._camEntity = value;
        }


        get drawables() {
            return this._drawables;
        }
    }

    class DrawableViewModel extends framework.ViewModel<DrawableComponent> {
        get viewFile() : string {
            return 'components/drawable';
        }
    }

    export class DrawableComponentFactory implements ComponentFactory {
        get name() {
            return "drawable";
        }

        createFormVM():framework.ViewModel<any> {
            return new DrawableViewModel();
        }

        createComponent():entityframework.Component {
            return new DrawableComponent();
        }
    }
}