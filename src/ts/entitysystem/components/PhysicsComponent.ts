///<reference path="../core/Component.ts"/>
module entityframework.components {

    import observe = framework.observe;
    import serialize = util.serialize;

    /**
     * Contains information about the entity's location and velocity.
     */
    class PhysicsInfo extends observe.Observable {
        @observe.Object()
        position : math.Vector;

        @observe.Object()
        velocity : math.Vector;

        /**
         * Create the position info object.
         * @param position Optional initial position.
         * @param velocity Optional initial velocity.
         */
        constructor(position? : math.Vector, velocity? : math.Vector) {
            super();

            this.position = position || new math.Vector();
            this.velocity = velocity || new math.Vector();
        }
    }

    @serialize.ProvideClass(PhysicsComponent, "ild::PlatformPhysicsComponent")
    export class PhysicsComponent extends Component {
        @observe.Object()
        info : PhysicsInfo;

        constructor (position? : math.Vector, velocity? : math.Vector) {
            super();
            this.info = new PhysicsInfo(position, velocity);
        }
    }

    class PhysicsViewModel extends framework.ViewModel<PhysicsComponent> {
        get viewFile() : string {
            return "components/physics";
        }
    }

    export class PhysicsComponentFactory implements ComponentFactory {

        get displayName() {
            return "Physics";
        }

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