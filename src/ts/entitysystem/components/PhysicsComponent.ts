///<reference path="../core/Component.ts"/>
///<reference path="../../framework/observe/Observable.ts"/>
///<reference path="../../framework/ViewModel.ts"/>
///<reference path="../../util/JsonLoader.ts"/>
module entityframework.components {

    import serialize = util.serialize;

    /**
     * Contains information about the entity's location and velocity.
     */
    class PhysicsInfo extends framework.observe.Observable {
        @serialize.Key("position")
        private _position : math.Vector;
        @serialize.Key("velocity")
        private _velocity : math.Vector;

        /**
         * Create the position info object.
         * @param position Optional initial position.
         * @param velocity Optional initial velocity.
         */
        constructor(position? : math.Vector, velocity? : math.Vector) {
            super();

            this._position = position || new math.Vector();
            this._velocity = velocity || new math.Vector();

            this._position.listenForChanges("position", this);
            this._velocity.listenForChanges("velocity", this);
        }

        //region Getters and Setters
        get position() {
            return this._position;
        }

        get velocity() {
            return this._velocity;
        }
        //endregion
    }

    @serialize.ProvideClass(PhysicsComponent, "ild::PlatformPhysicsComponent")
    export class PhysicsComponent extends Component {
        @serialize.Key("info")
        private _info : PhysicsInfo;

        constructor (position? : math.Vector, velocity? : math.Vector) {
            super();
            this._info = new PhysicsInfo(position, velocity);
            this._info.listenForChanges("info", this);
        }

        get info() {
            return this._info;
        }
    }

    class PhysicsViewModel extends framework.ViewModel<PhysicsComponent> {
        get viewFile() : string {
            return "components/physics";
        }
    }

    export class PhysicsComponentFactory implements ComponentFactory {

        get name() {
            return "physics";
        }

        createFormVM():framework.ViewModel<any> {
            return new PhysicsViewModel();
        }

        createComponent():entityframework.Component {
            return new PhysicsComponent();
        }
    }
}