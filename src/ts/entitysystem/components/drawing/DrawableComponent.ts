///<reference path="../../core/Component.ts"/>
module entityframework.components.drawing {
    export class DrawableComponent extends Component {
        private _camEntity : string;
        _drawables : framework.observe.ObservableMap<Drawable>;

        constructor() {
            super();
            this._drawables = new framework.observe.ObservableMap<Drawable>();
            this._drawables.listenForChanges("drawables", this);
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
            return "Drawable";
        }

        createFormVM():framework.ViewModel<any> {
            return new DrawableViewModel();
        }

        createComponent():entityframework.Component {
            return new DrawableComponent();
        }
    }
}