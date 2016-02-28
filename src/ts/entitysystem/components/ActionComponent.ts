///<reference path="../core/Component.ts"/>
///<reference path="../../framework/observe/ObservableArray.ts"/>
module entityframework.components {

    import serialize = util.serialize;
    import observe = framework.observe;

    export class VectorAction extends framework.observe.SimpleObservable {
        @observe.Primitive(Number)
        private tween : number;

        @observe.Object()
        private value : math.Vector;

        constructor(tween? : number, value? : math.Vector) {
            super();

            this.tween = tween || 0;
            this.value = value || new math.Vector();
        }
    }

    export class Actions extends framework.observe.SimpleObservable {
        @observe.Object()
        private platformVelocityActions : observe.ObservableArray<VectorAction>;

        @observe.Object()
        private platformPositionActions : observe.ObservableArray<VectorAction>;

        @observe.Primitive(Boolean)
        private affectedByGravity : boolean;

        constructor(platformVelocityActions? : observe.ObservableArray<VectorAction>, platformPositionActions? : observe.ObservableArray<VectorAction>, affectedByGravity? : boolean) {
            super();

            this.platformVelocityActions = platformVelocityActions || new observe.ObservableArray<VectorAction>();
            this.platformPositionActions = platformPositionActions || new observe.ObservableArray<VectorAction>();
            this.affectedByGravity = affectedByGravity || false;
        }
    }

    export class ActionComponent extends Component {
        @observe.Object()
        private actions : Actions;

        constructor(actions? : Actions) {
            super();

            this.actions = actions || new Actions();
        }
    }

    class ActionViewModel extends framework.ViewModel<ActionComponent> {
        get viewFile() : string {
            return "components/action";
        }
    }

    export class ActionComponentFactory implements ComponentFactory {

        /**
         * Creates the view model associated with a ActionComponent
         *
         * @returns new instance of ActionViewModel
         */
        createFormVM() : framework.ViewModel<any> {
            return new ActionViewModel();
        }

        /**
         * Creates the component object.
         *
         * @returns new instance of ActionComponent
         */
        createComponent() : entityframework.Component {
            return new ActionComponent();
        }

        //region Getters and Setters
        get name() {
            return "action";
        }

        get displayName() {
            return "Action";
        }
        //endregion
    }
}
