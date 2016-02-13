///<reference path="../core/Component.ts"/>
module entityframework.components {

    import serialize = util.serialize;
    import observe = framework.observe;

    export class CameraComponent extends Component {
        @ObservePrimitive(Number)
        private renderPriority : number;

        @ObservePrimitive(Number)
        private scale : number;

        @ObserveObject()
        private size : math.Vector;

        @ObservePrimitive(Boolean)
        private default : boolean;

        constructor(size? : math.Vector, scale? : number, renderPriority? : number, def? : boolean) {
            super();

            this.size = size || new math.Vector(0, 0);
            this.scale = scale || 1;
            this.renderPriority = renderPriority || 0;
            this.default = def || false;
        }
    }

    class CameraViewModel extends framework.ViewModel<CameraComponent> {
        get viewFile() : string {
            return "components/camera";
        }
    }

    export class CameraComponentFactory implements ComponentFactory {

        /**
         * Creates the view model associated with a CameraComponent
         *
         * @returns new instance of CameraViewModel
         */
        createFormVM() : framework.ViewModel<any> {
            return new CameraViewModel();
        }

        /**
         * Creates the component object.
         *
         * @returns new instance of CameraComponent
         */
        createComponent() : entityframework.Component {
            return new CameraComponent();
        }

        //region Getters and Setters
        get name() {
            return "camera";
        }

        get displayName() {
            return "Camera";
        }
        //endregion
    }
}
