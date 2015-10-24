///<reference path="../core/Component.ts"/>
module entityframework.components {

    import serialize = util.serialize;
    import observe = framework.observe;
    import setter = framework.setter;

    /**
     * The possible collision types for the game.
     */
    export enum CollisionType {
        None,
        Player,
        Ground
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
    class CollisionShapeInfo extends observe.Observable {
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

        /**
         * CollisionBodyType for the component.
         */
        @observe.Primitive(String)
        bodyType : string;

        /**
         * CollisionType for the component.
         */
        @observe.Primitive()
        collisionType : CollisionType;

        /**
         * Constructs a new CollisionComponent.
         *
         * @param dimensions Width and height of the bounding box, defaults to {0,0}
         * @param bodyType Collision body type for the component, default value is "none"
         * @param type CollisionType for the component, default value is CollisionType.None
         */
        constructor (dimensions? : math.Vector, bodyType? : string, type? : CollisionType) {
            super();

            this.info = new CollisionShapeInfo(dimensions);
            this.bodyType = bodyType || "none";
            this.collisionType = type || CollisionType.None;
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
    class CollisionViewModel extends framework.ViewModel<CollisionComponent> implements framework.observe.Observer {
        private typeVals : Array<number> = [];
        private bodyPicker : controls.SelectControl<string>;
        private collisionTypePicker : controls.SelectControl<CollisionType>;

        /**
         * Called by the view model when the data has been loaded.
         */
        onDataReady() {
            super.onDataReady();
            this.data.listenForChanges("data", this);
        }

        /**
         * Call by the view model when the view is ready to be shown.
         */
        onViewReady() {
            super.onViewReady();

            var typeVals = util.formatters.valuesFromEnum(CollisionType);

            this.collisionTypePicker = new controls.SelectControl<CollisionType>(
                this,
                "collisionPicker",
                typeVals,
                CollisionType[this.data.collisionType]);

            this.collisionTypePicker.callback = (collisionType) => this.onCollisionTypeSelected(this.data, collisionType);

            this.bodyPicker = new controls.SelectControl<string>(
                this,
                "bodyPicker",
                this.generateFormattedBodyTypes(),
                this.formatBodyType(this.data.bodyType));

            this.bodyPicker.callback = (bodyType) => this.onBodySelected(this.data, bodyType);
        }

        onDataChanged(key : string, event : framework.observe.DataChangeEvent) {
            if (key === "data") {
                if (event&& event.name == "collisionType") {
                    this.collisionTypePicker.value = CollisionType[this.data.collisionType];
                }
            }
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

        private onBodySelected(component : CollisionComponent, bodyType : string) {
            this.pushCommand(setter(
                bodyType,
                component.bodyType,
                (bodyType) => component.bodyType = bodyType));
        }

        private onCollisionTypeSelected(component : CollisionComponent, collisionType : CollisionType) {
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
        get componentConstructor() {
            return CollisionComponent;
        }

        get name() {
            return "collision";
        }

        get displayName() {
            return "Collision";
        }
        //endregion
    }
}
