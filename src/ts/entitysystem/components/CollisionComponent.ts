///<reference path="../core/Component.ts"/>
module entityframework.components {

    import serialize = util.serialize;
    import observe = framework.observe;
    import setter = framework.setter;

    /**
     * The possible collision types for the game.
     */
    export var CollisionType = {
        NONE: "none",
        PLAYER: "player",
        GROUND: "ground"
    }

    /**
     * The body types used for collision.
     */
    export var BodyType = {
        /**
         * The entity doesn't have an automatic response to the collision.
         */
        NONE: "none",

        /**
         * The entity doesn't let other entities pass through it. And isn't moved by other
         * entities.
         */
        ENVIRONMENT: "environment",

        /**
         * The entity doesn't let other entities pass through it, but can be moved by other
         * entities.
         */
        SOLID: "solid"
    }


    /**
     * Holds the bindable info for a CollisionComponent.
     */
    export class CollisionShapeInfo extends observe.SimpleObservable {
        /**
         * Width and height for the collision's bounding box.
         */
        @observe.Object()
        dimension : math.Vector;

        /**
         * Constructs a new CollisionInfo object.
         *
         * @param dimensions Width and height for the collision's bounding box, default value is {0,0}
         */
        constructor(dimensions? : math.Vector) {
            super();

            this.dimension = dimensions || new math.Vector();
        }
    }

    /**
     * Component class for an entity's collision information.
     */
    export class CollisionComponent extends Component {

        /**
         * Info instance holding the bindable properties.
         */
        @serialize.Key("dimension")
        @observe.Object()
        info : CollisionShapeInfo;

        @observe.Object()
        oneWayNormal: math.Vector;

        /**
         * CollisionBodyType for the component.
         */
        @observe.Primitive(String)
        bodyType : string;

        /**
         * CollisionType for the component.
         */
        @observe.Primitive()
        collisionType : string;

        /**
         * Constructs a new CollisionComponent.
         *
         * @param dimensions Width and height of the bounding box, defaults to {0,0}
         * @param bodyType Collision body type for the component, default value is "none"
         * @param type CollisionType for the component, default value is CollisionType.None
         */
        constructor (dimensions? : math.Vector, bodyType? : string, type? : string, oneWayNormal? : math.Vector) {
            super();

            this.info = new CollisionShapeInfo(dimensions);
            this.bodyType = bodyType || BodyType.NONE;
            this.collisionType = type || CollisionType.NONE;
            this.oneWayNormal = oneWayNormal || new math.Vector();
        }

        //region Getters and Setters
        set dimension(value) {
            this.info = value;
        }
        get dimension() {
            return this.info;
        }
        //endregion
    }

    /**
     * View Model for the collision component.
     */
    class CollisionViewModel extends framework.ViewModel<CollisionComponent> {
        private bodyPicker : controls.SelectControl<string>;
        private collisionTypePicker : controls.SelectControl<string>;

        /**
         * Called by the view model when the data has been loaded.
         */
        onDataReady() {
            super.onDataReady();
        }

        /**
         * Call by the view model when the view is ready to be shown.
         */
        onViewReady() {
            super.onViewReady();

            this.collisionTypePicker = new controls.SelectControl<string>(
                this,
                "collisionPicker",
                this.generateFormattedCollisionTypes(),
                this.formatCollisionType(this.data.collisionType));

            this.collisionTypePicker.callback = (collisionType) => this.onCollisionTypeSelected(this.data, collisionType);

            this.bodyPicker = new controls.SelectControl<string>(
                this,
                "bodyPicker",
                this.generateFormattedBodyTypes(),
                this.formatBodyType(this.data.bodyType));

            this.bodyPicker.callback = (bodyType) => this.onBodySelected(this.data, bodyType);
        }

        private formatBodyType(internal : string) : string {
            return util.formatters.formatToTitleCase(internal);
        }

        private generateFormattedBodyTypes() : { [ s : string ] : string } {
            var bodyTypes : { [ s : string ] : string } = {};
            for (var key in BodyType) {
                var external = this.formatBodyType(BodyType[key]);
                bodyTypes[external] = BodyType[key];
            }
            return bodyTypes;
        }

        private formatCollisionType(internal : string) : string {
            return util.formatters.formatToTitleCase(internal);
        }

        private generateFormattedCollisionTypes() : { [ s : string ] : string } {
            var collisionTypes : { [ s : string ] : string } = {};
            for (var key in CollisionType) {
                var external = this.formatCollisionType(CollisionType[key]);
                collisionTypes[external] = CollisionType[key];
            }
            return collisionTypes;
        }

        private onBodySelected(component : CollisionComponent, bodyType : string) {
            this.pushCommand(setter(
                bodyType,
                component.bodyType,
                (bodyType) => component.bodyType = bodyType));
        }

        private onCollisionTypeSelected(component : CollisionComponent, collisionType : string) {
            this.pushCommand(setter(
                collisionType,
                component.collisionType,
                (collisionType) => component.collisionType = collisionType));
        }

        //region Getters and Setters
        get viewFile() : string {
            return "components/collision";
        }
        //endregion
    }

    /**
     * Used to create CollisionComponents
     */
    export class CollisionComponentFactory implements ComponentFactory {

        /**
         * Creates the view model associated with a CollisionControl
         *
         * @returns new instance of CollisionViewModel
         */
        createFormVM() : framework.ViewModel<any> {
            return new CollisionViewModel();
        }

        /**
         * Creates the component object.
         *
         * @returns new instance of CollisionComponent
         */
        createComponent() : entityframework.Component {
            return new CollisionComponent();
        }

        //region Getters and Setters
        get name() {
            return "collision";
        }

        get displayName() {
            return "Collision";
        }
        //endregion
    }
}
